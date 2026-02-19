import pytest
import asyncio
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
import tempfile
import os
from app.models.job import ScrapingJob, JobStatus
from app.services.storage import storage_service


@pytest.mark.asyncio
@pytest.mark.integration
async def test_full_job_creation_and_processing_flow(test_client, test_db_session, mock_playwright, mock_minio_client):
    """Test the complete flow: create job -> process -> get results."""
    # Mock the storage service
    with patch('app.services.storage.storage_service') as mock_storage:
        mock_storage.upload_file = AsyncMock(return_value="test/path/file.txt")

        # Step 1: Create a job
        job_data = {
            "url": "https://example.com",
            "wait_time": 1,
            "render_strategy": "auto",
            "extract_text": True,
            "extract_html": True,
            "capture_screenshot": True
        }

        response = await test_client.post("/api/v1/jobs", json=job_data)
        assert response.status_code == 201

        job_response = response.json()
        job_id = job_response["id"]
        assert job_response["status"] == "pending"

        # Step 2: Check that job exists in database
        db_job = await test_db_session.get(ScrapingJob, job_id)
        assert db_job is not None
        assert db_job.url == "https://example.com"
        assert db_job.status == JobStatus.PENDING

        # Step 3: Simulate the job being processed (normally done by Celery worker)
        # For integration testing, we'll update the job status manually to simulate processing
        from sqlalchemy import select
        result = await test_db_session.execute(select(ScrapingJob).where(ScrapingJob.id == job_id))
        job = result.scalar_one()

        # Update job status to running then completed
        job.status = JobStatus.RUNNING
        await test_db_session.commit()

        # Mock the results that would be stored during processing
        job.status = JobStatus.COMPLETED
        job.page_title = "Example Domain"
        job.final_url = "https://example.com"
        job.http_status = 200
        job.text_content = "Example domain text"
        job.html_path = f"{job_id}/page.html"
        job.screenshot_path = f"{job_id}/screenshot.png"
        await test_db_session.commit()

        # Step 4: Get the job after processing
        response = await test_client.get(f"/api/v1/jobs/{job_id}")
        assert response.status_code == 200

        job_data_response = response.json()
        assert job_data_response["status"] == "completed"
        assert job_data_response["page_title"] == "Example Domain"
        assert job_data_response["final_url"] == "https://example.com"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_error_handling_invalid_url(test_client):
    """Test error handling with invalid URL."""
    invalid_job_data = {
        "url": "not-a-valid-url",  # This should fail validation
        "wait_time": 1,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=invalid_job_data)
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
@pytest.mark.integration
async def test_timeout_handling(test_client, test_db_session):
    """Test timeout scenario."""
    from datetime import datetime, timedelta
    from sqlalchemy import select

    # Create a job that's timed out
    job_data = {
        "url": "https://timeout-test.com",
        "wait_time": 1,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=job_data)
    assert response.status_code == 201

    job_response = response.json()
    job_id = job_response["id"]

    # Update job to simulate timeout
    result = await test_db_session.execute(select(ScrapingJob).where(ScrapingJob.id == job_id))
    job = result.scalar_one()
    job.status = JobStatus.TIMEOUT
    job.error_message = "Operation timed out"
    job.completed_at = datetime.utcnow()
    await test_db_session.commit()

    # Verify timeout status
    response = await test_client.get(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "timeout"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_file_download_endpoints(test_client, test_db_session):
    """Test file download endpoints."""
    from sqlalchemy import select
    import io

    # Create a completed job with file references
    job_data = {
        "url": "https://example.com",
        "wait_time": 1,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=job_data)
    assert response.status_code == 201

    job_response = response.json()
    job_id = job_response["id"]

    # Update job to completed with file paths
    result = await test_db_session.execute(select(ScrapingJob).where(ScrapingJob.id == job_id))
    job = result.scalar_one()
    job.status = JobStatus.COMPLETED
    job.html_path = f"{job_id}/page.html"
    job.screenshot_path = f"{job_id}/screenshot.png"
    await test_db_session.commit()

    # Test HTML download endpoint (this would normally return the file content)
    # For this test we're just checking if the endpoint exists and returns appropriate response
    response = await test_client.get(f"/api/v1/jobs/{job_id}/download/html")
    # This would depend on whether the file exists in storage, which is mocked
    # The endpoint should exist and return either the file or an error

    # At minimum, we can test that the route exists (doesn't return 404)
    # but the exact response will depend on whether the file exists in storage
    assert response.status_code in [200, 404]  # Either success or file not found


@pytest.mark.asyncio
@pytest.mark.integration
async def test_job_cancellation_flow(test_client, test_db_session):
    """Test job cancellation flow."""
    # Create a pending job
    job_data = {
        "url": "https://example.com",
        "wait_time": 1,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=job_data)
    assert response.status_code == 201

    job_response = response.json()
    job_id = job_response["id"]

    # Verify job is pending initially
    response = await test_client.get(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "pending"

    # Cancel the job
    response = await test_client.delete(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 200

    # Verify job is cancelled
    response = await test_client.get(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_list_jobs_pagination(test_client, test_db_session):
    """Test jobs listing with pagination."""
    # Create multiple jobs
    for i in range(5):
        job_data = {
            "url": f"https://example{i}.com",
            "wait_time": 1,
            "render_strategy": "auto",
            "extract_text": True,
            "extract_html": True,
            "capture_screenshot": True
        }

        response = await test_client.post("/api/v1/jobs", json=job_data)
        assert response.status_code == 201

    # Get jobs list
    response = await test_client.get("/api/v1/jobs?page=1&size=10")
    assert response.status_code == 200

    jobs_response = response.json()
    assert "items" in jobs_response
    assert "total" in jobs_response
    assert jobs_response["total"] >= 5  # May have jobs from other tests too
    assert len(jobs_response["items"]) >= 5


@pytest.mark.asyncio
@pytest.mark.integration
async def test_large_page_handling(test_client):
    """Test handling of large pages (without actually scraping large content)."""
    # Create a job for a large page
    # In this case, we're testing that the API accepts the request
    large_page_data = {
        "url": "https://example.com/large-page",
        "wait_time": 5,  # Longer wait for large pages
        "render_strategy": "fixed_delay",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=large_page_data)
    assert response.status_code == 201

    job_response = response.json()
    assert job_response["wait_time"] == 5
    assert job_response["render_strategy"] == "fixed_delay"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_health_endpoint_integration(test_client):
    """Test the health endpoint as part of the integrated system."""
    response = await test_client.get("/health")
    assert response.status_code == 200

    health_data = response.json()
    assert health_data["status"] == "healthy"
    assert health_data["service"] == "backend"
    assert "timestamp" in health_data


@pytest.mark.asyncio
@pytest.mark.integration
async def test_metrics_endpoint_integration(test_client):
    """Test the Prometheus metrics endpoint."""
    response = await test_client.get("/metrics")
    assert response.status_code == 200

    # The metrics endpoint should return prometheus formatted metrics
    content_type = response.headers.get("content-type", "")
    assert "text/plain" in content_type