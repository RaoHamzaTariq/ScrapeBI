import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from celery import Celery
from app.models.job import ScrapingJob, JobStatus
from app.core.exceptions import ScrapingError
from app.database import get_db_session
from app.services.scraping import ScrapingService
from app.services.storage import storage_service


@pytest.mark.asyncio
async def test_scrape_task_success(mock_celery, test_db_session, sample_job_data, mock_playwright):
    """Test successful execution of scrape task."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class, \
         patch('app.tasks.scrape.storage_service') as mock_storage:

        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_website method to return test data
        mock_scraping_service.scrape_with_playwright.return_value = {
            "html": "<html><body>Test</body></html>",
            "text": "Test",
            "screenshot": "test/path/screenshot.png"
        }

        # Mock storage service
        mock_storage.upload_file.return_value = "test/path/result.png"

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated
        await test_db_session.refresh(job)
        assert job.status == JobStatus.COMPLETED
        assert job.completed_at is not None

        # Verify the task returned success
        assert result["status"] == "completed"


@pytest.mark.asyncio
async def test_scrape_task_with_scraping_error(mock_celery, test_db_session, sample_job_data):
    """Test scrape task when ScrapingError occurs."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service to raise ScrapingError
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class:
        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to raise ScrapingError
        mock_scraping_service.scrape_with_playwright.side_effect = ScrapingError(
            message="Test scraping error", error_code="TEST_ERROR"
        )

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated to failed
        await test_db_session.refresh(job)
        assert job.status == JobStatus.FAILED
        assert job.error_message == "Test scraping error"
        assert job.completed_at is not None

        # Verify the task returned failure
        assert result["status"] == "failed"


@pytest.mark.asyncio
async def test_scrape_task_with_general_exception(mock_celery, test_db_session, sample_job_data):
    """Test scrape task when a general exception occurs."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service to raise a general exception
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class:
        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to raise a general exception
        mock_scraping_service.scrape_with_playwright.side_effect = Exception("General error")

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated to failed
        await test_db_session.refresh(job)
        assert job.status == JobStatus.FAILED
        assert job.error_message == "General error"
        assert job.completed_at is not None

        # Verify the task returned failure
        assert result["status"] == "failed"


@pytest.mark.asyncio
async def test_scrape_task_timeout(mock_celery, test_db_session, sample_job_data):
    """Test scrape task with timeout handling."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service to simulate timeout
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class:
        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to raise timeout exception
        mock_scraping_service.scrape_with_playwright.side_effect = TimeoutError("Operation timed out")

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated to timeout
        await test_db_session.refresh(job)
        assert job.status == JobStatus.TIMEOUT
        assert "timed out" in job.error_message.lower()
        assert job.completed_at is not None

        # Verify the task returned timeout
        assert result["status"] == "timeout"


@pytest.mark.asyncio
async def test_scrape_task_with_retry_logic(mock_celery, test_db_session, sample_job_data):
    """Test scrape task with retry logic."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service to fail initially, then succeed
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class, \
         patch('asyncio.sleep'):  # Mock sleep to avoid actual delays
        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # First call fails, second succeeds
        mock_scraping_service.scrape_with_playwright.side_effect = [
            Exception("First attempt fails"),
            {"html": "<html><body>Success</body></html>", "text": "Success", "screenshot": "path"}
        ]

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated to completed
        await test_db_session.refresh(job)
        assert job.status == JobStatus.COMPLETED
        assert job.retry_count == 1  # Should have retried once
        assert job.completed_at is not None

        # Verify the task returned success
        assert result["status"] == "completed"


@pytest.mark.asyncio
async def test_scrape_task_max_retries_exceeded(mock_celery, test_db_session, sample_job_data):
    """Test scrape task when max retries are exceeded."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    job.retry_count = 3  # Already at max retries
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service to always fail
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class:
        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to always raise exception
        mock_scraping_service.scrape_with_playwright.side_effect = Exception("Persistent error")

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job status was updated to failed
        await test_db_session.refresh(job)
        assert job.status == JobStatus.FAILED
        assert "Persistent error" in job.error_message
        assert job.completed_at is not None
        assert job.retry_count == 3  # Should not have incremented retry count

        # Verify the task returned failure
        assert result["status"] == "failed"


@pytest.mark.asyncio
async def test_scrape_task_job_not_found(mock_celery, test_db_session):
    """Test scrape task when job doesn't exist."""
    from app.tasks.scrape import scrape_website

    fake_job_id = "123e4567-e89b-12d3-a456-426614174000"

    # Run the task with non-existent job ID
    result = await scrape_website(fake_job_id)

    # Verify the task returned failure
    assert result["status"] == "failed"
    assert "not found" in result["error"].lower()


@pytest.mark.asyncio
async def test_scrape_task_update_job_status(mock_celery, test_db_session, sample_job_data):
    """Test that the task properly updates job status during execution."""
    from app.tasks.scrape import scrape_website

    # Create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Initially the job should be pending
    assert job.status == JobStatus.PENDING

    # Mock the scraping service
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class, \
         patch('app.tasks.scrape.storage_service') as mock_storage:

        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to return test data
        mock_scraping_service.scrape_with_playwright.return_value = {
            "html": "<html><body>Test</body></html>",
            "text": "Test",
            "screenshot": "test/path/screenshot.png"
        }

        # Mock storage service
        mock_storage.upload_file.return_value = "test/path/result.png"

        # Run the task
        await scrape_website(job.id)

        # Verify the job status transition: PENDING -> RUNNING -> COMPLETED
        await test_db_session.refresh(job)
        assert job.status == JobStatus.COMPLETED
        assert job.started_at is not None
        assert job.completed_at is not None


@pytest.mark.asyncio
async def test_scrape_task_with_different_extract_options(mock_celery, test_db_session):
    """Test scrape task with different extraction options."""
    from app.tasks.scrape import scrape_website

    # Create a job with only HTML extraction
    job_data = {
        "url": "https://example.com",
        "wait_time": 2,
        "render_strategy": "auto",
        "extract_text": False,  # Don't extract text
        "extract_html": True,   # Extract HTML
        "capture_screenshot": False  # Don't capture screenshot
    }

    job = ScrapingJob(**job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock the scraping service
    with patch('app.tasks.scrape.ScrapingService') as mock_scraping_service_class, \
         patch('app.tasks.scrape.storage_service') as mock_storage:

        mock_scraping_service = AsyncMock()
        mock_scraping_service_class.return_value = mock_scraping_service

        # Mock the scrape_with_playwright method to return test data
        mock_scraping_service.scrape_with_playwright.return_value = {
            "html": "<html><body>Test HTML only</body></html>",
            "text": "This should not be saved",  # This will be ignored based on job settings
            "screenshot": None  # No screenshot captured
        }

        # Mock storage service
        mock_storage.upload_file.return_value = "test/path/html.html"

        # Run the task
        result = await scrape_website(job.id)

        # Verify the job completed successfully
        await test_db_session.refresh(job)
        assert job.status == JobStatus.COMPLETED
        assert result["status"] == "completed"

        # Verify that only the requested extractions were processed
        # (implementation would check what was actually stored based on job settings)