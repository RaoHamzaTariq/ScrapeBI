import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
from uuid import UUID
import json
from app.models.job import JobStatus, ScrapingJob
from datetime import datetime


@pytest.mark.asyncio
async def test_create_job_success(test_client, sample_job_data):
    """Test successful job creation."""
    response = await test_client.post("/api/v1/jobs", json=sample_job_data)

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert UUID(data["id"])  # Ensure id is a valid UUID
    assert data["url"] == sample_job_data["url"]
    assert data["status"] == "pending"
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_job_invalid_url(test_client):
    """Test job creation with invalid URL."""
    invalid_data = {
        "url": "not-a-valid-url",
        "wait_time": 2,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    response = await test_client.post("/api/v1/jobs", json=invalid_data)

    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_create_job_missing_required_fields(test_client):
    """Test job creation with missing required fields."""
    incomplete_data = {
        "url": "https://example.com"
        # Missing other required fields
    }

    response = await test_client.post("/api/v1/jobs", json=incomplete_data)

    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_get_job_success(test_client, test_db_session, sample_job_data):
    """Test successful job retrieval."""
    # First, create a job in the database
    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    response = await test_client.get(f"/api/v1/jobs/{job.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(job.id)
    assert data["url"] == job.url
    assert data["status"] == job.status.value


@pytest.mark.asyncio
async def test_get_job_not_found(test_client):
    """Test retrieving a non-existent job."""
    fake_uuid = "123e4567-e89b-12d3-a456-426614174000"

    response = await test_client.get(f"/api/v1/jobs/{fake_uuid}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_jobs_list(test_client, test_db_session, sample_job_data):
    """Test retrieving a list of jobs."""
    # Create multiple jobs
    for i in range(3):
        job_data = sample_job_data.copy()
        job_data["url"] = f"https://example{i}.com"
        job = ScrapingJob(**job_data)
        test_db_session.add(job)

    await test_db_session.commit()

    response = await test_client.get("/api/v1/jobs")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "size" in data
    assert len(data["items"]) == 3


@pytest.mark.asyncio
async def test_cancel_job_pending(test_client, test_db_session, sample_job_data):
    """Test cancelling a pending job."""
    # Create a job in pending status
    job_data = sample_job_data.copy()
    job_data["status"] = JobStatus.PENDING
    job = ScrapingJob(**job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    response = await test_client.delete(f"/api/v1/jobs/{job.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(job.id)
    assert data["status"] == "cancelled"


@pytest.mark.asyncio
async def test_cancel_job_running(test_client, test_db_session, sample_job_data):
    """Test cancelling a running job (should fail)."""
    # Create a job in running status
    job_data = sample_job_data.copy()
    job_data["status"] = JobStatus.RUNNING
    job = ScrapingJob(**job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    response = await test_client.delete(f"/api/v1/jobs/{job.id}")

    assert response.status_code == 400  # Cannot cancel running job


@pytest.mark.asyncio
async def test_cancel_job_not_found(test_client):
    """Test cancelling a non-existent job."""
    fake_uuid = "123e4567-e89b-12d3-a456-426614174000"

    response = await test_client.delete(f"/api/v1/jobs/{fake_uuid}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_health_endpoint(test_client):
    """Test the health check endpoint."""
    response = await test_client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "backend"
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_invalid_method_on_job(test_client, sample_job_data):
    """Test invalid HTTP method on job endpoint."""
    response = await test_client.put("/api/v1/jobs", json=sample_job_data)

    assert response.status_code == 405  # Method not allowed