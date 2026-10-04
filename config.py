import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_DIR = BASE_DIR / "database"
DATABASE_DIR.mkdir(exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "student-ai-predictor-secure-secret-key-2026")
    DATABASE_PATH = os.environ.get("DATABASE_PATH", str(DATABASE_DIR / "student_performance.sqlite"))
    DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "127.0.0.1")
    APP_NAME = "AI Student Performance Predictor"
    VERSION = "1.0.0"
