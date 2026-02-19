import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.main import create_app
from app.database import engine, Base
from app.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Create a test database engine."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",  # Use in-memory SQLite for tests
        echo=False,
        pool_pre_ping=True,
    )
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def test_sessionmaker(test_engine):
    """Create a test sessionmaker."""
    sessionmaker_local = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    yield sessionmaker_local


@pytest_asyncio.fixture(scope="function")
async def test_db_session(test_sessionmaker):
    """Create a test database session."""
    async with test_sessionmaker() as session:
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        yield session
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def test_client(test_db_session):
    """Create a test client with mocked dependencies."""
    # Patch the database session dependency
    with patch("app.api.deps.get_db_session", return_value=test_db_session):
        app = create_app()
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac


@pytest.fixture
def mock_minio_client():
    """Mock MinIO client."""
    with patch("app.services.storage.Minio") as mock_minio:
        mock_client = MagicMock()
        mock_minio.return_value = mock_client
        yield mock_client


@pytest.fixture
def mock_playwright():
    """Mock Playwright browser and page."""
    with patch("app.services.scraping.async_playwright") as mock_async_playwright:
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()

        # Set up the mock chain: async_playwright() -> browser_type -> browser -> context -> page
        mock_browser_type = AsyncMock()
        mock_async_playwright.return_value.__aenter__.return_value = mock_browser_type
        mock_browser_type.chromium.launch.return_value = mock_browser
        mock_browser.new_context.return_value = mock_context
        mock_context.new_page.return_value = mock_page

        yield {
            "playwright": mock_async_playwright,
            "browser": mock_browser,
            "context": mock_context,
            "page": mock_page
        }


@pytest.fixture
def mock_celery():
    """Mock Celery for task testing."""
    with patch("app.tasks.scrape.scrape_website") as mock_task:
        yield mock_task


@pytest.fixture
def sample_job_data():
    """Sample job creation data."""
    return {
        "url": "https://example.com",
        "wait_time": 2,
        "render_strategy": "auto",
        "extract_text": True,
        "extract_html": True,
        "capture_screenshot": True
    }