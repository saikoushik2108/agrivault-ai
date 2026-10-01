import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Agrivault AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    # PostgreSQL connection string with fallback to SQLite for local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrivault.db")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
