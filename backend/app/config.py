from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database settings
    database_url: str = "postgresql+asyncpg://user:pass@db:5432/scraping"

    # Redis settings
    redis_url: str = "redis://redis:6379/0"

    # MinIO settings
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "scraping-bucket"

    # Celery settings
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/0"

    # Application settings
    max_concurrent_jobs: int = 5
    default_timeout: int = 300  # 5 minutes
    default_navigation_timeout: int = 30  # 30 seconds
    default_rendering_timeout: int = 60  # 60 seconds

    # Security settings
    allowed_domains: Optional[str] = None  # Comma-separated list of allowed domains
    blocked_ips: Optional[str] = None  # Comma-separated list of blocked IPs

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()