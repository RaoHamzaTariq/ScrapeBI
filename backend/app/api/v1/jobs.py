from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
import uuid

from app.database import get_db
from app.models.job import ScrapingJob, ScrapingJobStatus
from app.schemas.job import JobCreate, JobResponse, PaginatedJobList, JobStatus
from app.core.security import is_valid_url
from app.core.exceptions import ValidationError
from app.tasks.scrape import scrape_website_task
from app.config import settings

router = APIRouter()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_create: JobCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new scraping job"""
    # Validate URL
    if not is_valid_url(job_create.url):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL provided. URL must be a valid HTTP/HTTPS address and cannot be localhost or internal."
        )

    # Create the job in the database
    db_job = ScrapingJob(
        url=job_create.url,
        wait_time=job_create.wait_time,
        render_strategy=job_create.render_strategy.value,
        wait_for_selector=job_create.wait_for_selector,
        extract_text=job_create.extract_text,
        extract_html=job_create.extract_html,
        capture_screenshot=job_create.capture_screenshot,
        status=ScrapingJobStatus.PENDING
    )

    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)

    # Queue the scraping task
    try:
        scrape_website_task.delay(str(db_job.id))
    except Exception as e:
        # If task queuing fails, update the job status to failed
        db_job.status = ScrapingJobStatus.FAILED
        db_job.error_message = f"Failed to queue scraping task: {str(e)}"
        await db.commit()
        await db.refresh(db_job)

    return db_job


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get job status and results"""
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )

    query = select(ScrapingJob).where(ScrapingJob.id == job_uuid)
    result = await db.execute(query)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return job


@router.get("/{job_id}/stream")
async def stream_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Server-Sent Events endpoint for real-time job status updates"""
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )

    # This would normally be implemented with a proper SSE response
    # For now, returning a placeholder response
    from fastapi.responses import StreamingResponse
    import asyncio
    from datetime import datetime
    import json

    async def event_generator():
        # First, check if job exists
        query = select(ScrapingJob).where(ScrapingJob.id == job_uuid)
        result = await db.execute(query)
        job = result.scalar_one_or_none()

        if not job:
            yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
            return

        # Keep sending updates until job is completed
        while job.status in [ScrapingJobStatus.PENDING, ScrapingJobStatus.RUNNING]:
            status_update = JobStatus(
                job_id=job.id,
                status=job.status,
                message=f"Job is {job.status}",
                timestamp=datetime.utcnow()
            )

            yield f"data: {json.dumps(status_update.model_dump())}\n\n"
            await asyncio.sleep(2)  # Wait 2 seconds before next check

            # Refresh job from database
            result = await db.execute(query)
            job = result.scalar_one_or_none()

            if not job:
                break

        # Send final status
        if job:
            final_status = JobStatus(
                job_id=job.id,
                status=job.status,
                message=f"Job completed with status: {job.status}",
                timestamp=datetime.utcnow()
            )
            yield f"data: {json.dumps(final_status.model_dump())}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_job(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Cancel a pending job"""
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )

    query = select(ScrapingJob).where(ScrapingJob.id == job_uuid)
    result = await db.execute(query)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.status != ScrapingJobStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel job that is not in pending status"
        )

    # Update job status to canceled (we'll treat it as failed)
    job.status = ScrapingJobStatus.FAILED
    job.error_message = "Job was canceled by user"
    await db.commit()

    return


@router.get("/", response_model=PaginatedJobList)
async def list_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: ScrapingJobStatus = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """List jobs with pagination"""
    offset = (page - 1) * limit

    query = select(ScrapingJob)

    if status_filter:
        query = query.where(ScrapingJob.status == status_filter.value)

    # Count total
    count_query = select(func.count()).select_from(ScrapingJob)
    if status_filter:
        count_query = count_query.where(ScrapingJob.status == status_filter.value)

    count_result = await db.execute(count_query)
    total = count_result.scalar()

    # Get jobs with pagination
    query = query.offset(offset).limit(limit).order_by(ScrapingJob.created_at.desc())
    result = await db.execute(query)
    jobs = result.scalars().all()

    return PaginatedJobList(
        items=jobs,
        total=total,
        page=page,
        limit=limit,
        pages=max(1, (total + limit - 1) // limit)
    )