import asyncio
import sys
import os
from datetime import datetime

# Add the backend directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from celery import Celery
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from app.config import settings
from app.models.job import ScrapingJob, ScrapingJobStatus, RenderStrategy
from app.database import AsyncSessionLocal
from app.services.scraping import scrape_url
from app.services.storage import storage_service
from app.core.exceptions import BrowserError, NetworkError, TimeoutError, ScrapingError


# Create Celery app
celery_app = Celery('scrapeflow')
celery_app.conf.update(
    broker_url=settings.celery_broker_url,
    result_backend=settings.celery_result_backend,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_routes={
        'app.tasks.scrape.scrape_website': {'queue': 'scraping'},
    },
    worker_prefetch_multiplier=1,  # Process one task at a time to avoid browser conflicts
    task_acks_late=True,  # Acknowledge tasks after they're processed
    broker_connection_retry_on_startup=True,
    task_time_limit=300,  # 5 minutes hard limit
    task_soft_time_limit=240,  # 4 minutes soft limit
    worker_max_tasks_per_child=10,  # Restart worker process after 10 tasks to free memory
    worker_max_memory_per_child=200000,  # Restart if using more than 200MB
    result_expires=3600,  # Results expire after 1 hour
    worker_prefetch_enabled=True,
    task_ignore_result=False,  # We want to store results
    task_store_errors_even_if_ignored=True,
    worker_cancel_long_running_tasks_on_connection_loss=True,
)


@celery_app.task(
    bind=True,
    autoretry_for=(BrowserError, NetworkError, TimeoutError),
    retry_kwargs={'max_retries': 3},
    retry_backoff=True,
    retry_backoff_max=720,
    retry_jitter=True
)
def scrape_website(self, job_id: str):
    """Main scraping task function"""
    async def run_scraping():
        async with AsyncSessionLocal() as session:
            try:
                # Fetch the job from database
                result = await session.execute(
                    select(ScrapingJob).where(ScrapingJob.id == job_id)
                )
                job = result.scalar_one_or_none()

                if not job:
                    raise ScrapingError(f"Job with ID {job_id} not found")

                # Update job status to running
                stmt = update(ScrapingJob).where(ScrapingJob.id == job_id).values(
                    status=ScrapingJobStatus.RUNNING,
                    started_at=func.now(),
                    retry_count=self.request.retries  # Update retry count
                )
                await session.execute(stmt)
                await session.commit()

                # Call the scraping service
                scraping_result = await scrape_url(
                    url=job.url,
                    render_strategy=job.render_strategy,
                    wait_time=job.wait_time,
                    wait_for_selector=job.wait_for_selector,
                    capture_screenshot=job.capture_screenshot,
                    extract_html=job.extract_html,
                    extract_text=job.extract_text
                )

                # Prepare results paths
                results_paths = {}

                # Upload screenshot if captured
                if 'screenshot' in scraping_result and job.capture_screenshot:
                    screenshot_path = await storage_service.upload_file(
                        job_id=job.id,
                        filename="screenshot.png",
                        content=scraping_result['screenshot'],
                        content_type="image/png"
                    )
                    results_paths['screenshot_path'] = screenshot_path

                # Upload HTML if captured
                if 'html' in scraping_result and job.extract_html:
                    html_path = await storage_service.upload_file(
                        job_id=job.id,
                        filename="page.html",
                        content=scraping_result['html'],
                        content_type="text/html"
                    )
                    results_paths['html_path'] = html_path

                # Upload text if captured
                if 'text' in scraping_result and job.extract_text:
                    # If text content is small enough, store in DB, otherwise in MinIO
                    text_content = scraping_result['text'].decode('utf-8')
                    if len(text_content) < 100 * 1024:  # < 100KB
                        job.text_content = text_content
                    else:
                        text_path = await storage_service.upload_file(
                            job_id=job.id,
                            filename="text.txt",
                            content=scraping_result['text'],
                            content_type="text/plain"
                        )
                        results_paths['text_path'] = text_path

                # Update job status to completed with all results and metadata
                stmt = update(ScrapingJob).where(ScrapingJob.id == job_id).values(
                    status=ScrapingJobStatus.COMPLETED,
                    completed_at=func.now(),
                    screenshot_path=results_paths.get('screenshot_path'),
                    html_path=results_paths.get('html_path'),
                    page_title=scraping_result.get('page_title'),
                    final_url=scraping_result.get('final_url'),
                    error_message=None  # Clear any previous error
                )
                await session.execute(stmt)
                await session.commit()

                return {
                    "status": "completed",
                    "job_id": job_id,
                    "results_paths": results_paths
                }

            except (BrowserError, NetworkError, TimeoutError) as e:
                # These are retryable errors - update status and retry
                stmt = update(ScrapingJob).where(ScrapingJob.id == job_id).values(
                    status=ScrapingJobStatus.FAILED,
                    error_message=f"Scraping error: {str(e)}",
                    completed_at=func.now()
                )
                await session.execute(stmt)
                await session.commit()
                raise  # Re-raise to trigger retry

            except Exception as e:
                # Non-retryable errors - update status and return failure
                stmt = update(ScrapingJob).where(ScrapingJob.id == job_id).values(
                    status=ScrapingJobStatus.FAILED,
                    error_message=f"Unexpected error: {str(e)}",
                    completed_at=func.now()
                )
                await session.execute(stmt)
                await session.commit()

                return {
                    "status": "failed",
                    "job_id": job_id,
                    "error": str(e)
                }

    # Run the async function
    return asyncio.run(run_scraping())


if __name__ == '__main__':
    celery_app.start()