from celery import Celery
from app.config import settings


def create_celery_app() -> Celery:
    """Create and configure Celery app"""
    celery_app = Celery('scrapeflow')

    # Configure Celery
    celery_app.conf.update(
        # Broker settings
        broker_url=settings.celery_broker_url,
        result_backend=settings.celery_result_backend,

        # Serialization
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,

        # Task routing
        task_routes={
            'app.tasks.scrape.scrape_website': {'queue': 'scraping'},
        },

        # Worker settings
        worker_prefetch_multiplier=1,  # Process one task at a time to avoid browser conflicts
        task_acks_late=True,  # Acknowledge tasks after they're processed
        broker_connection_retry_on_startup=True,

        # Task limits
        task_time_limit=300,  # 5 minutes hard limit
        task_soft_time_limit=240,  # 4 minutes soft limit

        # Memory management
        worker_max_tasks_per_child=10,  # Restart worker process after 10 tasks to free memory
        worker_max_memory_per_child=200000,  # Restart if using more than 200MB

        # Result settings
        result_expires=3600,  # Results expire after 1 hour
        worker_prefetch_enabled=True,
        task_ignore_result=False,  # We want to store results
        task_store_errors_even_if_ignored=True,
        worker_cancel_long_running_tasks_on_connection_loss=True,

        # Concurrency
        worker_concurrency=settings.max_concurrent_jobs,  # Limit concurrent tasks based on config
    )

    # Auto-discover tasks
    celery_app.autodiscover_tasks(['app.tasks'])

    return celery_app


# Create the Celery app instance
celery_app = create_celery_app()


if __name__ == '__main__':
    celery_app.start()