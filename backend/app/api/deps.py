from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db_session
from app.config import settings
from minio import Minio
import redis.asyncio as redis


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async for session in get_db_session():
        yield session


def get_minio_client():
    """Dependency to get MinIO client"""
    client = Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=False  # Set to True in production with SSL
    )

    # Ensure bucket exists
    if not client.bucket_exists(settings.minio_bucket):
        client.make_bucket(settings.minio_bucket)

    return client


async def get_redis_client():
    """Dependency to get Redis client for rate limiting"""
    client = redis.from_url(settings.redis_url, decode_responses=True)
    return client


async def rate_limit_dependency(
    redis_client: redis.Redis = Depends(get_redis_client)
):
    """Dependency for rate limiting based on IP address"""
    # This is a simplified rate limiting implementation
    # In a real application, you'd use a more sophisticated system like slowapi
    pass