import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, quiz, challenge

app = FastAPI(
    title="QuizMind AI API",
    description="Backend API for QuizMind AI - Study Quiz Generator",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Pre-populate achievements table
    from app.database import async_session_maker
    from app.models import Achievement
    async with async_session_maker() as session:
        try:
            from sqlalchemy.future import select
            stmt = select(Achievement)
            result = await session.execute(stmt)
            exists = result.scalars().first()
            if not exists:
                default_achievements = [
                    Achievement(id="first_assessment", name="First Assessment Completed", description="Complete your first quiz assessment.", category="Learning", xp_reward=100, icon_name="Award"),
                    Achievement(id="quizzes_10", name="10 Quizzes Completed", description="Complete 10 quiz assessments.", category="Learning", xp_reward=200, icon_name="BookOpen"),
                    Achievement(id="quizzes_50", name="50 Quizzes Completed", description="Complete 50 quiz assessments.", category="Learning", xp_reward=500, icon_name="Layers"),
                    Achievement(id="quizzes_100", name="100 Quizzes Completed", description="Complete 100 quiz assessments.", category="Learning", xp_reward=1000, icon_name="GraduationCap"),
                    Achievement(id="perfect_accuracy", name="Perfect Accuracy", description="Score 100% on any quiz.", category="Performance", xp_reward=150, icon_name="ShieldCheck"),
                    Achievement(id="consistency_builder", name="Consistency Builder", description="Maintain a consecutive 3-day consistency streak.", category="Consistency", xp_reward=150, icon_name="Flame"),
                    Achievement(id="streak_7", name="7-Day Streak", description="Maintain a consecutive 7-day consistency streak.", category="Consistency", xp_reward=300, icon_name="Calendar"),
                    Achievement(id="streak_30", name="30-Day Streak", description="Maintain a consecutive 30-day consistency streak.", category="Consistency", xp_reward=1000, icon_name="Sparkles"),
                    Achievement(id="questions_1000", name="1000 Questions Answered", description="Answer 1,000 questions across all quizzes.", category="Mastery", xp_reward=500, icon_name="Compass"),
                    Achievement(id="ai_explorer", name="AI Explorer", description="Generate quizzes using both Groq and Gemini model providers.", category="Exploration", xp_reward=200, icon_name="Cpu"),
                    Achievement(id="document_analyst", name="Document Analyst", description="Complete 10 document-based quizzes.", category="Exploration", xp_reward=250, icon_name="FileText"),
                    Achievement(id="knowledge_master", name="Knowledge Master", description="Complete 10 topic-based quizzes.", category="Mastery", xp_reward=250, icon_name="BookOpen"),
                    Achievement(id="fast_learner", name="Fast Learner", description="Score above 90% accuracy on hard difficulty.", category="Performance", xp_reward=300, icon_name="Zap")
                ]
                session.add_all(default_achievements)
                await session.commit()
                print("Default achievements pre-populated.")
        except Exception as e:
            await session.rollback()
            print(f"Error populating achievements: {e}")

# Register routers
app.include_router(auth.router)
app.include_router(quiz.router)
app.include_router(challenge.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the QuizMind AI API. Active and healthy!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
