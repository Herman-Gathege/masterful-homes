import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultkey")

    db_url = os.getenv("DATABASE_URL")
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ✅ Define JWT secrets as class attributes
    JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkey")
    JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", "superrefreshsecretkey")
