from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Security / Auth
    SECRET_KEY: str = "mysecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    MONGO_URL: str = "mongodb://localhost:27017"

    # CORS
    FRONTEND_ORIGIN: str | None = None
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()


