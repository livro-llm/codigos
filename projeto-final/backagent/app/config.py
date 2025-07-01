import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://user:pass@localhost:5432/postgresql")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
