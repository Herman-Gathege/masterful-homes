import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultkey")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///db.sqlite3")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET = os.getenv("JWT_SECRET", "your-access-secret-key")
    JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", "your-refresh-secret-key")


