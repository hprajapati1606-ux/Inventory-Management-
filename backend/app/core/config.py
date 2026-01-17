from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory Management System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "secret_key_for_demo_purposes_only_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./inventory.db"

    class Config:
        env_file = ".env"

settings = Settings()
