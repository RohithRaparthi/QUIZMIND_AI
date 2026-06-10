import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json

class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str = "your_groq_api_key_here"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_API_KEY: str = "your_gemini_api_key_here"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = '["http://localhost:5173", "http://localhost:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return ["http://localhost:5173", "http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
