from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import StreamingResponse
import uuid
from typing import Optional
import io

from app.database import get_db
from app.models.job import ScrapingJob, ScrapingJobStatus
from app.api.deps import get_minio_client
from app.config import settings
from sqlalchemy import select

router = APIRouter()


@router.get("/{job_id}/download/{result_type}")
async def download_result(
    job_id: str,
    result_type: str,  # html, text, or screenshot
    db: AsyncSession = Depends(get_db),
    minio_client=Depends(get_minio_client)
):
    """Download HTML, text, or screenshot result"""
    # Validate job_id format
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )

    # Validate result type
    valid_types = ["html", "text", "screenshot"]
    if result_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid result type. Valid types are: {', '.join(valid_types)}"
        )

    # Get job from database
    query = select(ScrapingJob).where(ScrapingJob.id == job_uuid)
    result = await db.execute(query)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.status != ScrapingJobStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job is not completed. Current status: {job.status}"
        )

    # Map result type to file path and content type
    path_attr = f"{result_type}_path"
    file_path = getattr(job, path_attr, None)

    if not file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{result_type} result not available for this job"
        )

    # Download from MinIO
    try:
        response = minio_client.get_object(settings.minio_bucket, file_path)
        content = response.read()

        # Set appropriate content type
        content_types = {
            "html": "text/html",
            "text": "text/plain",
            "screenshot": "image/png"
        }

        # Determine filename based on result type
        if result_type == "screenshot":
            filename = f"job_{job_id}_screenshot.png"
        elif result_type == "html":
            filename = f"job_{job_id}_page.html"
        else:  # text
            filename = f"job_{job_id}_content.txt"

        return StreamingResponse(
            io.BytesIO(content),
            media_type=content_types[result_type],
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving file from storage: {str(e)}"
        )
    finally:
        response.close()
        response.release_conn()


@router.get("/{job_id}/preview")
async def preview_result(
    job_id: str,
    result_type: str = "html",  # html, text, or screenshot
    db: AsyncSession = Depends(get_db),
    minio_client=Depends(get_minio_client)
):
    """Inline preview for iframe - serves content directly"""
    # Validate job_id format
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )

    # Validate result type
    valid_types = ["html", "text", "screenshot"]
    if result_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid result type. Valid types are: {', '.join(valid_types)}"
        )

    # Get job from database
    query = select(ScrapingJob).where(ScrapingJob.id == job_uuid)
    result = await db.execute(query)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.status != ScrapingJobStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job is not completed. Current status: {job.status}"
        )

    # Map result type to file path and content type
    path_attr = f"{result_type}_path"
    file_path = getattr(job, path_attr, None)

    if not file_path:
        if result_type == "text" and job.text_content:
            # If text content is stored in DB instead of MinIO
            return Response(
                content=job.text_content,
                media_type="text/plain"
            )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{result_type} result not available for this job"
        )

    # Download from MinIO
    try:
        response = minio_client.get_object(settings.minio_bucket, file_path)
        content = response.read()

        # Set appropriate content type
        content_types = {
            "html": "text/html",
            "text": "text/plain",
            "screenshot": "image/png"
        }

        return Response(
            content=content,
            media_type=content_types[result_type]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving file from storage: {str(e)}"
        )
    finally:
        response.close()
        response.release_conn()