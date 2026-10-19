from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ForgeFlow"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "forgeflow-super-secret-dev-jwt-key-2026-secure-32chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database: Supports SQLite for zero-config local dev & tests, PostgreSQL for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./forgeflow.db")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # AI Provider Settings: 'mock' (deterministic fallback), 'openai', 'gemini'
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
