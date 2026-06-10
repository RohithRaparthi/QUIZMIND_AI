from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import List, Optional

# --- Authentication Schemas ---

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Quiz Creation Schemas ---

class TopicQuizRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    num_questions: int = Field(5, ge=5, le=15)
    difficulty: str = Field("medium", pattern="^(easy|medium|hard)$")


# --- Quiz Attempt/Submit Schemas ---

class QuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    model_config = ConfigDict(from_attributes=True)

class QuizOut(BaseModel):
    quiz_id: int
    title: str
    difficulty: str
    question_count: int
    questions: List[QuestionOut]

    model_config = ConfigDict(from_attributes=True)

class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: Optional[str] = Field(None, pattern="^[A-D]$|^$")  # A, B, C, D or empty for skipped

class QuizSubmitRequest(BaseModel):
    quiz_id: int
    answers: List[AnswerSubmit]

class QuestionResultOut(BaseModel):
    question_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    selected_answer: Optional[str]
    correct_answer: str
    is_correct: bool
    explanation: str
    source_text: Optional[str]

class QuizSubmitResponse(BaseModel):
    attempt_id: int
    quiz_id: int
    score: int
    percentage: float
    provider_used: str
    attempted_at: datetime
    results: List[QuestionResultOut]

    model_config = ConfigDict(from_attributes=True)


# --- History & Analytics Schemas ---

class QuizHistoryItem(BaseModel):
    attempt_id: int
    quiz_title: str
    quiz_type: str
    difficulty: str
    score: int
    question_count: int
    percentage: float
    provider_used: str
    attempted_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RecentAttempt(BaseModel):
    attempt_id: int
    quiz_title: str
    percentage: float
    attempted_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AnalyticsStats(BaseModel):
    total_attempts: int
    avg_score: float
    highest_score: float
    lowest_score: float
    accuracy_percentage: float

class TopicPerformance(BaseModel):
    topic: str
    avg_percentage: float

class DifficultyPerformance(BaseModel):
    difficulty: str
    avg_percentage: float

class AccuracyTrendItem(BaseModel):
    date: str
    percentage: float

class AnalyticsResponse(BaseModel):
    stats: AnalyticsStats
    recent_attempts: List[RecentAttempt]
    topic_performance: List[TopicPerformance]
    difficulty_performance: List[DifficultyPerformance]
    accuracy_trend: List[AccuracyTrendItem]
