import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.scraping import ScrapingService
from app.models.job import ScrapingJob, JobStatus
from app.core.exceptions import ScrapingError


@pytest.mark.asyncio
async def test_scraping_service_initialization():
    """Test scraping service initialization."""
    service = ScrapingService()

    assert service is not None


@pytest.mark.asyncio
async def test_scrape_website_success(mock_playwright, test_db_session, sample_job_data):
    """Test successful website scraping."""
    service = ScrapingService()

    # Mock the page.content() method to return HTML
    mock_playwright["page"].content.return_value = "<html><body>Test content</body></html>"
    mock_playwright["page"].inner_text.return_value = "Test content"
    mock_playwright["page"].title.return_value = "Test Title"
    mock_playwright["page"].url = "https://example.com/final"

    job = ScrapingJob(**sample_job_data)
    test_db_session.add(job)
    await test_db_session.commit()
    await test_db_session.refresh(job)

    # Mock storage service
    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.png"

        result = await service.scrape_website(
            job=job,
            page=mock_playwright["page"]
        )

        # Verify the result structure
        assert result is not None
        assert "html" in result
        assert "text" in result
        assert "screenshot" in result


@pytest.mark.asyncio
async def test_scrape_with_auto_strategy(mock_playwright, sample_job_data):
    """Test scraping with auto render strategy."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    mock_page.content.return_value = "<html><body>Auto strategy content</body></html>"
    mock_page.inner_text.return_value = "Auto strategy content"
    mock_page.title.return_value = "Auto Strategy Title"

    job = ScrapingJob(**sample_job_data)

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.png"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that wait_for_load_state was called for auto strategy
        mock_page.wait_for_load_state.assert_called()


@pytest.mark.asyncio
async def test_scrape_with_fixed_delay_strategy(mock_playwright):
    """Test scraping with fixed delay strategy."""
    job_data = {
        "url": "https://example.com",
        "wait_time": 3,
        "render_strategy": "fixed_delay",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    service = ScrapingService()

    mock_page = mock_playwright["page"]
    mock_page.content.return_value = "<html><body>Fixed delay content</body></html>"
    mock_page.inner_text.return_value = "Fixed delay content"
    mock_page.title.return_value = "Fixed Delay Title"

    job = ScrapingJob(**job_data)

    with patch('app.services.scraping.storage_service') as mock_storage, \
         patch('asyncio.sleep') as mock_sleep:
        mock_storage.upload_file.return_value = "test/path/file.png"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that sleep was called with the specified wait time
        mock_sleep.assert_called_with(3)


@pytest.mark.asyncio
async def test_scrape_with_element_wait_strategy(mock_playwright):
    """Test scraping with element wait strategy."""
    job_data = {
        "url": "https://example.com",
        "wait_time": 0,
        "render_strategy": "wait_for_element",
        "wait_for_selector": "#test-element",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }

    service = ScrapingService()

    mock_page = mock_playwright["page"]
    mock_page.content.return_value = "<html><body>Element wait content</body></html>"
    mock_page.inner_text.return_value = "Element wait content"
    mock_page.title.return_value = "Element Wait Title"

    job = ScrapingJob(**job_data)

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.png"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that wait_for_selector was called with the specified selector
        mock_page.wait_for_selector.assert_called_with("#test-element")


@pytest.mark.asyncio
async def test_scrape_capture_screenshot(mock_playwright, sample_job_data):
    """Test capturing screenshot during scraping."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    mock_page.content.return_value = "<html><body>Screenshot test</body></html>"
    mock_page.inner_text.return_value = "Screenshot test"
    mock_page.title.return_value = "Screenshot Test"
    mock_page.screenshot.return_value = b"fake-screenshot-bytes"

    job = ScrapingJob(**sample_job_data)

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/screenshot.png"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that screenshot was called
        mock_page.screenshot.assert_called()
        # Verify that screenshot was included in result
        assert "screenshot" in result


@pytest.mark.asyncio
async def test_scrape_extract_html(mock_playwright, sample_job_data):
    """Test extracting HTML during scraping."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    expected_html = "<html><body>HTML content</body></html>"
    mock_page.content.return_value = expected_html
    mock_page.inner_text.return_value = "Text content"
    mock_page.title.return_value = "HTML Test"

    job = ScrapingJob(**sample_job_data)

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.html"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that content was extracted
        mock_page.content.assert_called()
        # Verify that HTML content is in result
        assert result["html"] == expected_html


@pytest.mark.asyncio
async def test_scrape_extract_text(mock_playwright, sample_job_data):
    """Test extracting text during scraping."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    mock_page.content.return_value = "<html><body>HTML content</body></html>"
    expected_text = "Text content"
    mock_page.inner_text.return_value = expected_text
    mock_page.title.return_value = "Text Test"

    job = ScrapingJob(**sample_job_data)

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.txt"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that inner_text was called
        mock_page.inner_text.assert_called()
        # Verify that text content is in result
        assert result["text"] == expected_text


@pytest.mark.asyncio
async def test_scrape_with_timeout(mock_playwright, sample_job_data):
    """Test scraping with timeout handling."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    # Mock a timeout scenario
    mock_page.content.side_effect = TimeoutError("Navigation timeout")

    job = ScrapingJob(**sample_job_data)

    with pytest.raises(ScrapingError) as exc_info:
        await service.scrape_website(
            job=job,
            page=mock_page
        )

    assert "timeout" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_scrape_with_network_error(mock_playwright, sample_job_data):
    """Test scraping with network error handling."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    # Mock a network error
    mock_page.content.side_effect = Exception("Network error")

    job = ScrapingJob(**sample_job_data)

    with pytest.raises(ScrapingError) as exc_info:
        await service.scrape_website(
            job=job,
            page=mock_page
        )

    assert "network" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_scrape_with_retries(mock_playwright, sample_job_data):
    """Test scraping with retry logic."""
    service = ScrapingService()

    mock_page = mock_playwright["page"]
    # First call fails, second succeeds
    mock_page.content.side_effect = [Exception("First try fails"), "<html>Success</html>"]
    mock_page.inner_text.return_value = "Success text"
    mock_page.title.return_value = "Success Title"

    job = ScrapingJob(**sample_job_data)
    job.retry_count = 1  # Allow 1 retry

    with patch('app.services.scraping.storage_service') as mock_storage:
        mock_storage.upload_file.return_value = "test/path/file.html"

        result = await service.scrape_website(
            job=job,
            page=mock_page
        )

        # Verify that content was called twice (first fail, then success)
        assert mock_page.content.call_count == 2
        # Verify success
        assert result["html"] == "<html>Success</html>"