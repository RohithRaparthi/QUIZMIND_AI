from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_type = Column(String(50), nullable=False)  # 'document' or 'topic'
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), nullable=False)  # 'easy', 'medium', 'hard'
    question_count = Column(Integer, nullable=False)
    provider_used = Column(String(50), nullable=False)  # 'grok', 'gemini'
    status = Column(String(50), default="generated", nullable=False)  # 'generated', 'attempted', 'completed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_answer = Column(String(1), nullable=False)  # 'A', 'B', 'C', 'D'
    explanation = Column(Text, nullable=False)
    source_text = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("AttemptAnswer", back_populates="question", cascade="all, delete-orphan")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    provider_used = Column(String(50), nullable=False)  # 'grok', 'gemini'
    attempted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_answer = Column(String(1), nullable=True)  # 'A', 'B', 'C', 'D' (or null if skipped)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")
