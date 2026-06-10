import logging
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import User, Quiz, Question, QuizAttempt, AttemptAnswer
from app.schemas import (
    TopicQuizRequest, QuizOut, QuestionOut, QuizSubmitRequest, QuizSubmitResponse,
    QuestionResultOut, QuizHistoryItem, AnalyticsResponse, AnalyticsStats,
    RecentAttempt, TopicPerformance, DifficultyPerformance, AccuracyTrendItem, UserOut
)
from app.auth import get_current_user
from app.services.llm.manager import LLMManager
from app.services.text_extractor import extract_text
from app.services.challenge import ProgressService

router = APIRouter(tags=["quizzes"])
logger = logging.getLogger(__name__)
llm_manager = LLMManager()

@router.post("/generate-topic-quiz", response_model=QuizOut)
async def generate_topic_quiz(
    request: TopicQuizRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Generate quiz questions using LLM Manager (will try Groq, then Gemini)
        questions_data, provider = await llm_manager.generate_quiz(
            prompt_content=request.topic,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            is_grounded=False
        )
        
        # Create Quiz entry
        new_quiz = Quiz(
            user_id=current_user.id,
            quiz_type="topic",
            title=f"{request.topic} Quiz",
            difficulty=request.difficulty,
            question_count=len(questions_data),
            provider_used=provider,
            status="generated"
        )
        db.add(new_quiz)
        await db.flush() # Populate new_quiz.id
        
        # Create Question entries
        db_questions = []
        for q in questions_data:
            new_question = Question(
                quiz_id=new_quiz.id,
                question_text=q["question"],
                option_a=q["options"][0],
                option_b=q["options"][1],
                option_c=q["options"][2],
                option_d=q["options"][3],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                source_text=q["source_text"]
            )
            db.add(new_question)
            db_questions.append(new_question)
            
        await db.flush()
        
        # Map questions for response (excluding correct answer / explanation to prevent cheating)
        response_questions = [
            QuestionOut(
                id=q.id,
                question_text=q.question_text,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d
            )
            for q in db_questions
        ]
        
        return QuizOut(
            quiz_id=new_quiz.id,
            title=new_quiz.title,
            difficulty=new_quiz.difficulty,
            question_count=new_quiz.question_count,
            questions=response_questions
        )
    except Exception as e:
        logger.error(f"Failed to generate topic quiz: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )

@router.post("/generate-document-quiz", response_model=QuizOut)
async def generate_document_quiz(
    file: UploadFile = File(...),
    num_questions: int = Form(5),
    difficulty: str = Form("medium"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type extension
    filename = file.filename or "document.txt"
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload PDF, DOCX, or TXT."
        )

    try:
        # Extract text from file bytes
        file_bytes = await file.read()
        extracted_text = extract_text(file_bytes, filename)
        
        # Validate content length
        text_len = len(extracted_text.strip())
        if text_len < 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Extracted text content is too short (min 100 characters). Please provide a richer file."
            )
        
        # Max limit safety protection (e.g. 50,000 characters)
        if text_len > 50000:
            logger.info(f"Uploaded text length is {text_len}. Truncating to 50,000 characters for safety.")
            extracted_text = extracted_text[:50000]

        # Generate grounded quiz questions
        questions_data, provider = await llm_manager.generate_quiz(
            prompt_content=extracted_text,
            num_questions=num_questions,
            difficulty=difficulty,
            is_grounded=True
        )
        
        # Create Quiz entry
        new_quiz = Quiz(
            user_id=current_user.id,
            quiz_type="document",
            title=f"{filename} Quiz",
            difficulty=difficulty,
            question_count=len(questions_data),
            provider_used=provider,
            status="generated"
        )
        db.add(new_quiz)
        await db.flush()
        
        # Create Question entries
        db_questions = []
        for q in questions_data:
            new_question = Question(
                quiz_id=new_quiz.id,
                question_text=q["question"],
                option_a=q["options"][0],
                option_b=q["options"][1],
                option_c=q["options"][2],
                option_d=q["options"][3],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                source_text=q["source_text"]
            )
            db.add(new_question)
            db_questions.append(new_question)
            
        await db.flush()
        
        # Map questions for response (excluding correct answer / explanation to prevent cheating)
        response_questions = [
            QuestionOut(
                id=q.id,
                question_text=q.question_text,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d
            )
            for q in db_questions
        ]
        
        return QuizOut(
            quiz_id=new_quiz.id,
            title=new_quiz.title,
            difficulty=new_quiz.difficulty,
            question_count=new_quiz.question_count,
            questions=response_questions
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate document quiz: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )

@router.post("/submit-quiz", response_model=QuizSubmitResponse)
async def submit_quiz(
    request: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch quiz and its questions
    result = await db.execute(select(Quiz).filter(Quiz.id == request.quiz_id))
    quiz = result.scalars().first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    if quiz.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this quiz")

    # Load questions
    q_result = await db.execute(select(Question).filter(Question.quiz_id == quiz.id))
    questions = q_result.scalars().all()
    questions_dict = {q.id: q for q in questions}

    # Calculate score
    score = 0
    results_list = []
    answers_to_save = []

    # Map request answers
    submitted_answers_dict = {ans.question_id: ans.selected_answer for ans in request.answers}

    for q_id, question in questions_dict.items():
        selected = submitted_answers_dict.get(q_id)
        # Normalize selected answer
        if selected:
            selected = selected.upper()
        else:
            selected = ""

        is_correct = (selected == question.correct_answer.upper())
        if is_correct:
            score += 1

        results_list.append(
            QuestionResultOut(
                question_id=question.id,
                question_text=question.question_text,
                option_a=question.option_a,
                option_b=question.option_b,
                option_c=question.option_c,
                option_d=question.option_d,
                selected_answer=selected if selected else None,
                correct_answer=question.correct_answer,
                is_correct=is_correct,
                explanation=question.explanation,
                source_text=question.source_text
            )
        )

    # Save Attempt details
    percentage = (score / len(questions)) * 100.0 if questions else 0.0
    new_attempt = QuizAttempt(
        quiz_id=quiz.id,
        user_id=current_user.id,
        score=score,
        percentage=round(percentage, 1),
        provider_used=quiz.provider_used
    )
    db.add(new_attempt)
    await db.flush() # Get new_attempt.id

    # Save attempt answers
    for q_id in questions_dict.keys():
        selected = submitted_answers_dict.get(q_id)
        if selected:
            selected = selected.upper()
        else:
            selected = None
            
        new_answer = AttemptAnswer(
            attempt_id=new_attempt.id,
            question_id=q_id,
            selected_answer=selected
        )
        db.add(new_answer)

    # Update Quiz status
    quiz.status = "completed"
    await db.flush()

    # Process progression update
    xp_updates = None
    try:
        xp_updates = await ProgressService.process_quiz_completion(
            db=db,
            user_id=current_user.id,
            quiz_attempt=new_attempt,
            total_questions=len(questions),
            correct_answers=score
        )
    except Exception as e:
        logger.error(f"Failed to process progression update: {e}")

    return QuizSubmitResponse(
        attempt_id=new_attempt.id,
        quiz_id=quiz.id,
        score=score,
        percentage=new_attempt.percentage,
        provider_used=new_attempt.provider_used,
        attempted_at=new_attempt.attempted_at,
        results=results_list,
        xp_updates=xp_updates
    )

@router.get("/quiz-history", response_model=List[QuizHistoryItem])
async def get_quiz_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query all attempts by current user
    stmt = (
        select(QuizAttempt, Quiz.title, Quiz.quiz_type, Quiz.difficulty, Quiz.question_count)
        .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.attempted_at.desc())
    )
    result = await db.execute(stmt)
    history_items = []
    
    for row in result.all():
        attempt, quiz_title, quiz_type, difficulty, question_count = row
        history_items.append(
            QuizHistoryItem(
                attempt_id=attempt.id,
                quiz_title=quiz_title,
                quiz_type=quiz_type,
                difficulty=difficulty,
                score=attempt.score,
                question_count=question_count,
                percentage=attempt.percentage,
                provider_used=attempt.provider_used,
                attempted_at=attempt.attempted_at
            )
        )
    return history_items

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch all attempts for user
    stmt = (
        select(QuizAttempt, Quiz.title, Quiz.quiz_type, Quiz.difficulty, Quiz.question_count)
        .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.attempted_at.asc())
    )
    result = await db.execute(stmt)
    attempts_rows = result.all()

    # If no attempts exist, return empty analytics structure
    if not attempts_rows:
        return AnalyticsResponse(
            stats=AnalyticsStats(
                total_attempts=0,
                avg_score=0.0,
                highest_score=0.0,
                lowest_score=0.0,
                accuracy_percentage=0.0
            ),
            recent_attempts=[],
            topic_performance=[],
            difficulty_performance=[],
            accuracy_trend=[]
        )

    # 1. Compute stats
    percentages = [row[0].percentage for row in attempts_rows]
    total_attempts = len(attempts_rows)
    avg_score = round(sum(percentages) / total_attempts, 1)
    highest_score = max(percentages)
    lowest_score = min(percentages)

    # 2. Recent attempts (last 5 attempts sorted descending)
    recent_attempts_list = []
    # Sort descending for recent
    sorted_desc_attempts = sorted(attempts_rows, key=lambda r: r[0].attempted_at, reverse=True)
    for row in sorted_desc_attempts[:5]:
        attempt, quiz_title, _, _, _ = row
        recent_attempts_list.append(
            RecentAttempt(
                attempt_id=attempt.id,
                quiz_title=quiz_title,
                percentage=attempt.percentage,
                attempted_at=attempt.attempted_at
            )
        )

    # 3. Topic-wise performance (using quiz title)
    topic_scores = {}
    for row in attempts_rows:
        attempt, quiz_title, quiz_type, _, _ = row
        # Clean title to extract topic name, e.g. "Python Quiz" -> "Python"
        topic = quiz_title.replace(" Quiz", "") if quiz_title.endswith(" Quiz") else quiz_title
        if topic not in topic_scores:
            topic_scores[topic] = []
        topic_scores[topic].append(attempt.percentage)
        
    topic_performance_list = [
        TopicPerformance(topic=t, avg_percentage=round(sum(pcts) / len(pcts), 1))
        for t, pcts in topic_scores.items()
    ]

    # 4. Difficulty-wise performance
    diff_scores = {}
    for row in attempts_rows:
        attempt, _, _, difficulty, _ = row
        if difficulty not in diff_scores:
            diff_scores[difficulty] = []
        diff_scores[difficulty].append(attempt.percentage)
        
    difficulty_performance_list = [
        DifficultyPerformance(difficulty=d, avg_percentage=round(sum(pcts) / len(pcts), 1))
        for d, pcts in diff_scores.items()
    ]

    # 5. Accuracy Trend (chronological list)
    accuracy_trend_list = []
    for row in attempts_rows:
        attempt, _, _, _, _ = row
        # Format date as YYYY-MM-DD
        date_str = attempt.attempted_at.strftime("%Y-%m-%d")
        accuracy_trend_list.append(
            AccuracyTrendItem(
                date=date_str,
                percentage=attempt.percentage
            )
        )

    return AnalyticsResponse(
        stats=AnalyticsStats(
            total_attempts=total_attempts,
            avg_score=avg_score,
            highest_score=highest_score,
            lowest_score=lowest_score,
            accuracy_percentage=avg_score
        ),
        recent_attempts=recent_attempts_list,
        topic_performance=topic_performance_list,
        difficulty_performance=difficulty_performance_list,
        accuracy_trend=accuracy_trend_list
    )

@router.get("/user-profile", response_model=UserOut)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    return UserOut(
        id=current_user.id,
        username=current_user.username,
        created_at=current_user.created_at
    )
