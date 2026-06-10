import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_

from app.models import UserProgress, Achievement, UserAchievement, UserActivity, QuizAttempt, Quiz

logger = logging.getLogger(__name__)

# Level Config Mapping
LEVEL_CONFIGS = {
    1: {"name": "Beginner", "min_xp": 0},
    2: {"name": "Learner", "min_xp": 200},
    3: {"name": "Explorer", "min_xp": 500},
    4: {"name": "Analyst", "min_xp": 900},
    5: {"name": "Practitioner", "min_xp": 1400},
    6: {"name": "Engineer", "min_xp": 2000},
    7: {"name": "Specialist", "min_xp": 2700},
    8: {"name": "Expert", "min_xp": 3500},
    9: {"name": "Advanced Expert", "min_xp": 4400},
    10: {"name": "Master", "min_xp": 5400},
}

class LevelService:
    @staticmethod
    def calculate_level(total_xp: int) -> Dict[str, Any]:
        """
        Dynamically calculate user level based on total XP.
        Returns level info: level number, name, XP progress percentage, XP remaining.
        """
        current_level = 1
        level_name = "Beginner"
        
        # Determine current level
        for lvl, cfg in sorted(LEVEL_CONFIGS.items(), key=lambda x: x[0]):
            if total_xp >= cfg["min_xp"]:
                current_level = lvl
                level_name = cfg["name"]
            else:
                break
                
        # Calculate progress to next level
        current_min = LEVEL_CONFIGS[current_level]["min_xp"]
        
        if current_level < 10:
            next_level = current_level + 1
            next_min = LEVEL_CONFIGS[next_level]["min_xp"]
            xp_in_level = total_xp - current_min
            level_range = next_min - current_min
            progress_percent = round((xp_in_level / level_range) * 100, 1) if level_range > 0 else 0.0
            xp_remaining = next_min - total_xp
            next_level_xp = next_min
        else:
            # Max Level 10
            progress_percent = 100.0
            xp_remaining = 0
            next_level_xp = current_min

        return {
            "level_number": current_level,
            "level_name": level_name,
            "total_xp": total_xp,
            "xp_for_current_level": current_min,
            "xp_for_next_level": next_level_xp,
            "progress_percent": min(100.0, max(0.0, progress_percent)),
            "xp_remaining": xp_remaining
        }

class XPService:
    @staticmethod
    def calculate_quiz_xp(correct_answers: int, total_questions: int, is_first_of_day: bool) -> int:
        """
        Calculate XP earned from quiz submission.
        """
        if total_questions <= 0:
            return 0
            
        xp = 20  # Base Quiz Completed XP
        accuracy = (correct_answers / total_questions) * 100.0
        
        if accuracy > 90.0:
            xp += 50
        elif accuracy > 70.0:
            xp += 30
            
        if is_first_of_day:
            xp += 25
            
        return xp

class StreakService:
    @staticmethod
    def update_streak(current_streak: int, best_streak: int, last_activity_date: Optional[datetime]) -> Tuple[int, int, bool]:
        """
        Evaluate and update user streak metrics.
        Returns: (new_current_streak, new_best_streak, is_first_of_day)
        """
        now = datetime.utcnow()
        today = now.date()
        
        if last_activity_date is None:
            # Brand new activity
            return 1, max(1, best_streak), True
            
        last_date = last_activity_date.date()
        days_diff = (today - last_date).days
        
        if days_diff == 0:
            # Already did a quiz today
            return current_streak, best_streak, False
        elif days_diff == 1:
            # Consecutive day
            new_streak = current_streak + 1
            return new_streak, max(new_streak, best_streak), True
        else:
            # Streak broken, reset to 1
            return 1, best_streak, True

class ActivityService:
    @staticmethod
    async def log_activity(db: AsyncSession, user_id: int, activity_type: str, xp_earned: int, metadata: Dict[str, Any] = None) -> UserActivity:
        """
        Log an entry in the user_activity table.
        """
        activity = UserActivity(
            user_id=user_id,
            activity_type=activity_type,
            xp_earned=xp_earned,
            activity_metadata=metadata or {}
        )
        db.add(activity)
        await db.flush()
        return activity

class AchievementService:
    @staticmethod
    async def get_or_create_progress(db: AsyncSession, user_id: int) -> UserProgress:
        """Helper to get user progress, or create if missing"""
        stmt = select(UserProgress).filter(UserProgress.user_id == user_id)
        result = await db.execute(stmt)
        progress = result.scalars().first()
        if not progress:
            progress = UserProgress(
                user_id=user_id,
                total_xp=0,
                current_streak=0,
                best_streak=0,
                quizzes_completed=0,
                questions_answered=0
            )
            db.add(progress)
            await db.flush()
        return progress

    @staticmethod
    async def check_achievements(
        db: AsyncSession, 
        user_id: int, 
        progress: UserProgress, 
        last_attempt: QuizAttempt, 
        correct_answers: int, 
        total_questions: int
    ) -> List[Achievement]:
        """
        Check and award any unlocked achievements.
        Returns a list of achievements unlocked during this check.
        """
        # Fetch earned achievement IDs
        earned_stmt = select(UserAchievement.achievement_id).filter(UserAchievement.user_id == user_id)
        res = await db.execute(earned_stmt)
        earned_ids = set(res.scalars().all())
        
        # Load all achievements
        all_stmt = select(Achievement)
        all_res = await db.execute(all_stmt)
        achievements_catalog = all_res.scalars().all()
        ach_dict = {a.id: a for a in achievements_catalog}
        
        unlocked_this_time = []
        
        # Helper to unlock
        async def unlock(ach_id: str):
            if ach_id not in earned_ids and ach_id in ach_dict:
                earned = UserAchievement(user_id=user_id, achievement_id=ach_id)
                db.add(earned)
                earned_ids.add(ach_id)
                ach = ach_dict[ach_id]
                unlocked_this_time.append(ach)
                # Apply XP reward
                progress.total_xp += ach.xp_reward
                # Log activity
                await ActivityService.log_activity(
                    db=db,
                    user_id=user_id,
                    activity_type="ACHIEVEMENT_UNLOCKED",
                    xp_earned=ach.xp_reward,
                    metadata={"achievement_id": ach.id, "achievement_name": ach.name}
                )

        # 1. First Assessment Completed
        if "first_assessment" not in earned_ids:
            if progress.quizzes_completed >= 1:
                await unlock("first_assessment")
                
        # 2. 10 Quizzes Completed
        if "quizzes_10" not in earned_ids:
            if progress.quizzes_completed >= 10:
                await unlock("quizzes_10")
                
        # 3. 50 Quizzes Completed
        if "quizzes_50" not in earned_ids:
            if progress.quizzes_completed >= 50:
                await unlock("quizzes_50")
                
        # 4. 100 Quizzes Completed
        if "quizzes_100" not in earned_ids:
            if progress.quizzes_completed >= 100:
                await unlock("quizzes_100")
                
        # 5. Perfect Accuracy
        if "perfect_accuracy" not in earned_ids:
            if correct_answers == total_questions and total_questions > 0:
                await unlock("perfect_accuracy")
                
        # 6. Consistency Builder (3-Day Streak)
        if "consistency_builder" not in earned_ids:
            if progress.current_streak >= 3:
                await unlock("consistency_builder")
                
        # 7. 7-Day Streak
        if "streak_7" not in earned_ids:
            if progress.current_streak >= 7:
                await unlock("streak_7")
                
        # 8. 30-Day Streak
        if "streak_30" not in earned_ids:
            if progress.current_streak >= 30:
                await unlock("streak_30")
                
        # 9. 1000 Questions Answered
        if "questions_1000" not in earned_ids:
            if progress.questions_answered >= 1000:
                await unlock("questions_1000")
                
        # 10. AI Explorer (Both groq/grok and gemini used)
        if "ai_explorer" not in earned_ids:
            # Query providers used in past attempts
            prov_stmt = select(QuizAttempt.provider_used).filter(QuizAttempt.user_id == user_id).distinct()
            prov_res = await db.execute(prov_stmt)
            providers = set(prov_res.scalars().all())
            # Normalize provider names (grok / groq are treated matching Groq)
            has_groq = any(p in ["groq", "grok"] for p in providers)
            has_gemini = "gemini" in providers
            if has_groq and has_gemini:
                await unlock("ai_explorer")
                
        # 11. Document Analyst (10 Document-based quizzes completed)
        if "document_analyst" not in earned_ids:
            doc_stmt = (
                select(func.count(QuizAttempt.id))
                .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
                .filter(and_(QuizAttempt.user_id == user_id, Quiz.quiz_type == "document"))
            )
            doc_res = await db.execute(doc_stmt)
            doc_count = doc_res.scalar() or 0
            if doc_count >= 10:
                await unlock("document_analyst")
                
        # 12. Knowledge Master (10 Topic-based quizzes completed)
        if "knowledge_master" not in earned_ids:
            topic_stmt = (
                select(func.count(QuizAttempt.id))
                .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
                .filter(and_(QuizAttempt.user_id == user_id, Quiz.quiz_type == "topic"))
            )
            topic_res = await db.execute(topic_stmt)
            topic_count = topic_res.scalar() or 0
            if topic_count >= 10:
                await unlock("knowledge_master")
                
        # 13. Fast Learner (Score > 90% on hard difficulty)
        if "fast_learner" not in earned_ids:
            # Get difficulty of current quiz
            quiz_stmt = select(Quiz.difficulty).filter(Quiz.id == last_attempt.quiz_id)
            quiz_res = await db.execute(quiz_stmt)
            diff = quiz_res.scalar()
            accuracy = (correct_answers / total_questions) * 100.0 if total_questions > 0 else 0.0
            if diff == "hard" and accuracy >= 90.0:
                await unlock("fast_learner")
                
        return unlocked_this_time

class ProgressService:
    @staticmethod
    async def process_quiz_completion(
        db: AsyncSession, 
        user_id: int, 
        quiz_attempt: QuizAttempt, 
        total_questions: int, 
        correct_answers: int
    ) -> Dict[str, Any]:
        """
        Process the entire user progression cycle on quiz completion.
        Updates streaks, levels, logs activity, checks achievements, and returns summary.
        """
        progress = await AchievementService.get_or_create_progress(db, user_id)
        
        # Keep track of old state to determine changes
        old_xp = progress.total_xp
        old_level_info = LevelService.calculate_level(old_xp)
        
        # 1. Update Streak
        new_streak, new_best, is_first_of_day = StreakService.update_streak(
            current_streak=progress.current_streak,
            best_streak=progress.best_streak,
            last_activity_date=progress.last_activity_date
        )
        
        progress.current_streak = new_streak
        progress.best_streak = new_best
        
        # 2. Calculate XP
        xp_earned = XPService.calculate_quiz_xp(correct_answers, total_questions, is_first_of_day)
        progress.total_xp += xp_earned
        
        # 3. Update generic stats
        progress.quizzes_completed += 1
        progress.questions_answered += total_questions
        progress.last_activity_date = datetime.utcnow()
        
        # Log quiz completed activity
        # Fetch quiz title
        quiz_title_stmt = select(Quiz.title).filter(Quiz.id == quiz_attempt.quiz_id)
        quiz_title_res = await db.execute(quiz_title_stmt)
        quiz_title = quiz_title_res.scalar() or "AI Quiz"
        
        await ActivityService.log_activity(
            db=db,
            user_id=user_id,
            activity_type="QUIZ_COMPLETED",
            xp_earned=xp_earned,
            metadata={"quiz_id": quiz_attempt.quiz_id, "quiz_title": quiz_title, "score": correct_answers, "total": total_questions}
        )
        
        # 4. Check Level Up (Stage 1)
        level_info_1 = LevelService.calculate_level(progress.total_xp)
        if level_info_1["level_number"] > old_level_info["level_number"]:
            await ActivityService.log_activity(
                db=db,
                user_id=user_id,
                activity_type="LEVEL_UP",
                xp_earned=0,
                metadata={"from_level": old_level_info["level_number"], "to_level": level_info_1["level_number"], "level_name": level_info_1["level_name"]}
            )
            
        # 5. Check Achievements
        unlocked_achievements = await AchievementService.check_achievements(
            db=db,
            user_id=user_id,
            progress=progress,
            last_attempt=quiz_attempt,
            correct_answers=correct_answers,
            total_questions=total_questions
        )
        
        # 6. Check Level Up (Stage 2 - post achievement XP)
        level_info_final = LevelService.calculate_level(progress.total_xp)
        level_up_occurred = level_info_final["level_number"] > old_level_info["level_number"]
        
        # If leveled up on Stage 2 but not Stage 1
        if level_info_final["level_number"] > level_info_1["level_number"]:
            await ActivityService.log_activity(
                db=db,
                user_id=user_id,
                activity_type="LEVEL_UP",
                xp_earned=0,
                metadata={"from_level": level_info_1["level_number"], "to_level": level_info_final["level_number"], "level_name": level_info_final["level_name"]}
            )
            
        # Log streak milestone if applicable
        if new_streak in [7, 30, 100] and is_first_of_day:
            await ActivityService.log_activity(
                db=db,
                user_id=user_id,
                activity_type="STREAK_MILESTONE",
                xp_earned=0,
                metadata={"streak_days": new_streak}
            )

        # Commit changes to DB
        await db.flush()
        
        return {
            "xp_earned": xp_earned,
            "new_total_xp": progress.total_xp,
            "previous_level": old_level_info["level_number"],
            "current_level": level_info_final["level_number"],
            "level_name": level_info_final["level_name"],
            "level_up": level_up_occurred,
            "level_info": level_info_final,
            "unlocked_achievements": [
                {
                    "id": a.id,
                    "name": a.name,
                    "description": a.description,
                    "xp_reward": a.xp_reward,
                    "icon_name": a.icon_name,
                    "category": a.category
                } for a in unlocked_achievements
            ]
        }

    @staticmethod
    async def get_dashboard_data(db: AsyncSession, user_id: int) -> Dict[str, Any]:
        """
        Aggregate progress, achievements, timeline logs, and heatmap inputs for the Dashboard.
        """
        progress = await AchievementService.get_or_create_progress(db, user_id)
        level_info = LevelService.calculate_level(progress.total_xp)
        
        # 1. Profile information
        profile = {
            "username": progress.user.username if progress.user else "",
            "total_xp": progress.total_xp,
            "current_streak": progress.current_streak,
            "best_streak": progress.best_streak,
            "quizzes_completed": progress.quizzes_completed,
            "questions_answered": progress.questions_answered,
            "last_activity_date": progress.last_activity_date.isoformat() if progress.last_activity_date else None
        }
        
        # 2. Get achievements
        # Fetch earned achievements
        earned_stmt = select(UserAchievement).filter(UserAchievement.user_id == user_id)
        earned_res = await db.execute(earned_stmt)
        earned_objs = earned_res.scalars().all()
        earned_map = {ea.achievement_id: ea.earned_at for ea in earned_objs}
        
        # Fetch all achievements catalog
        ach_stmt = select(Achievement).order_by(Achievement.created_at.asc())
        ach_res = await db.execute(ach_stmt)
        ach_catalog = ach_res.scalars().all()
        
        achievements_list = []
        for ach in ach_catalog:
            earned = ach.id in earned_map
            achievements_list.append({
                "id": ach.id,
                "name": ach.name,
                "description": ach.description,
                "category": ach.category,
                "xp_reward": ach.xp_reward,
                "icon_name": ach.icon_name,
                "earned": earned,
                "earned_at": earned_map[ach.id].isoformat() if earned else None
            })
            
        # 3. Recent Activity Logs (UserActivity table - limit 10)
        act_stmt = (
            select(UserActivity)
            .filter(UserActivity.user_id == user_id)
            .order_by(UserActivity.created_at.desc())
            .limit(10)
        )
        act_res = await db.execute(act_stmt)
        activities = act_res.scalars().all()
        
        activity_logs = []
        for act in activities:
            activity_logs.append({
                "id": act.id,
                "activity_type": act.activity_type,
                "xp_earned": act.xp_earned,
                "metadata": act.activity_metadata,
                "created_at": act.created_at.isoformat()
            })
            
        # 4. Consistency Heatmap (Last 90 days)
        # Fetch quiz attempts over last 90 days
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        attempt_stmt = (
            select(QuizAttempt.attempted_at)
            .filter(and_(QuizAttempt.user_id == user_id, QuizAttempt.attempted_at >= cutoff_date))
        )
        attempt_res = await db.execute(attempt_stmt)
        attempts = attempt_res.scalars().all()
        
        # Count quizzes by date string YYYY-MM-DD
        heatmap_counts = {}
        for att in attempts:
            date_str = att.strftime("%Y-%m-%d")
            heatmap_counts[date_str] = heatmap_counts.get(date_str, 0) + 1
            
        heatmap_list = [{"date": k, "count": v} for k, v in heatmap_counts.items()]
        
        # 5. Learning Insights
        # We can calculate: Strongest Topic, Weakest Topic, Average Accuracy, and accuracy trend in last 14 days
        insights = {
            "strongest_topic": "N/A",
            "weakest_topic": "N/A",
            "avg_accuracy": 0.0,
            "improvement_trend": 0.0
        }
        
        # Retrieve all attempts to calculate accuracy and topics
        stmt = (
            select(QuizAttempt.percentage, Quiz.title, QuizAttempt.attempted_at)
            .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
            .filter(QuizAttempt.user_id == user_id)
            .order_by(QuizAttempt.attempted_at.desc())
        )
        hist_res = await db.execute(stmt)
        attempts_data = hist_res.all()
        
        if attempts_data:
            total_pct = sum(row[0] for row in attempts_data)
            insights["avg_accuracy"] = round(total_pct / len(attempts_data), 1)
            
            # Topic scores mapping
            topic_scores = {}
            for pct, title, _ in attempts_data:
                topic = title.replace(" Quiz", "") if title.endswith(" Quiz") else title
                if topic not in topic_scores:
                    topic_scores[topic] = []
                topic_scores[topic].append(pct)
                
            topic_avg = {t: sum(p)/len(p) for t, p in topic_scores.items()}
            
            if topic_avg:
                sorted_topics = sorted(topic_avg.items(), key=lambda x: x[1])
                insights["strongest_topic"] = sorted_topics[-1][0]
                # Only set weakest if there are multiple topics, or if we have at least one topic
                insights["weakest_topic"] = sorted_topics[0][0]
                
            # Improvement Trend in last 14 days vs prior 14 days
            date_14_ago = datetime.utcnow() - timedelta(days=14)
            date_28_ago = datetime.utcnow() - timedelta(days=28)
            
            recent_pcts = [row[0] for row in attempts_data if row[2] >= date_14_ago]
            older_pcts = [row[0] for row in attempts_data if date_28_ago <= row[2] < date_14_ago]
            
            if recent_pcts and older_pcts:
                avg_recent = sum(recent_pcts) / len(recent_pcts)
                avg_older = sum(older_pcts) / len(older_pcts)
                insights["improvement_trend"] = round(avg_recent - avg_older, 1)
            elif recent_pcts:
                # If only recent attempts exist, we can show improvement compared to the average of older
                insights["improvement_trend"] = 0.0 # Or default 0
                
        return {
            "profile": profile,
            "progress": level_info,
            "achievements": achievements_list,
            "recent_activity": activity_logs,
            "heatmap": heatmap_list,
            "insights": insights
        }
