import asyncio
from typing import Optional
from uuid import UUID
from minio import Minio
from minio.error import S3Error
from io import BytesIO
from app.config import settings


class StorageService:
    def __init__(self):
        self.client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=False  # Set to True in production with SSL
        )
        self.bucket_name = settings.minio_bucket

    async def init_bucket(self):
        """Create bucket if it doesn't exist"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
        except S3Error as e:
            raise Exception(f"Error initializing bucket: {str(e)}")

    async def upload_file(self, job_id: UUID, filename: str, content: bytes, content_type: str = "application/octet-stream") -> str:
        """Upload a file to MinIO and return the object path"""
        try:
            object_name = f"{job_id}/{filename}"

            # Upload the file
            result = self.client.put_object(
                self.bucket_name,
                object_name,
                BytesIO(content),
                length=len(content),
                content_type=content_type
            )

            return object_name
        except S3Error as e:
            raise Exception(f"Error uploading file: {str(e)}")

    async def download_file(self, job_id: UUID, filename: str) -> bytes:
        """Download a file from MinIO"""
        try:
            object_name = f"{job_id}/{filename}"

            # Get the file
            response = self.client.get_object(self.bucket_name, object_name)
            try:
                content = response.read()
                return content
            finally:
                response.close()
                response.release_conn()
        except S3Error as e:
            raise Exception(f"Error downloading file: {str(e)}")

    async def get_presigned_url(self, job_id: UUID, filename: str, expiry: int = 3600) -> str:
        """Generate a presigned URL for a file"""
        try:
            object_name = f"{job_id}/{filename}"

            # Generate presigned URL
            url = self.client.presigned_get_object(
                self.bucket_name,
                object_name,
                expires=expiry
            )

            return url
        except S3Error as e:
            raise Exception(f"Error generating presigned URL: {str(e)}")

    async def delete_job_files(self, job_id: UUID):
        """Delete all files associated with a job"""
        try:
            object_name_prefix = f"{job_id}/"

            # List all objects with the job ID prefix
            objects = self.client.list_objects(
                self.bucket_name,
                prefix=object_name_prefix,
                recursive=True
            )

            # Collect object names to delete
            objects_to_delete = [obj.object_name for obj in objects]

            if objects_to_delete:
                # Delete all objects
                for delete_err in self.client.remove_objects(self.bucket_name, objects_to_delete):
                    raise Exception(f"Error deleting object: {delete_err}")
        except S3Error as e:
            raise Exception(f"Error deleting job files: {str(e)}")

    async def file_exists(self, job_id: UUID, filename: str) -> bool:
        """Check if a file exists in MinIO"""
        try:
            object_name = f"{job_id}/{filename}"

            self.client.stat_object(self.bucket_name, object_name)
            return True
        except S3Error as e:
            if e.code == "NoSuchKey":
                return False
            raise Exception(f"Error checking if file exists: {str(e)}")


# Global instance
storage_service = StorageService()