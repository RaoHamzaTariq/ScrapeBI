from sqlalchemy import Column, String, DateTime, Integer, Boolean, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class ScrapingJobStatus:
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMEOUT = "timeout"


class RenderStrategy:
    AUTO = "auto"
    FIXED_DELAY = "fixed_delay"
    WAIT_FOR_ELEMENT = "wait_for_element"


class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic job fields
    url = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default=ScrapingJobStatus.PENDING)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Rendering configuration
    wait_time = Column(Integer, default=0)  # seconds, 0-60
    render_strategy = Column(String(20), default=RenderStrategy.AUTO)
    wait_for_selector = Column(Text, nullable=True)

    # Extraction toggles
    extract_text = Column(Boolean, default=True)
    extract_html = Column(Boolean, default=True)
    capture_screenshot = Column(Boolean, default=True)

    # Results (stored in MinIO, references here)
    screenshot_path = Column(Text, nullable=True)
    html_path = Column(Text, nullable=True)
    text_content = Column(Text, nullable=True)  # stored in DB if <100KB, else MinIO

    # Metadata
    page_title = Column(Text, nullable=True)
    final_url = Column(Text, nullable=True)  # after redirects
    http_status = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)

    # Execution timestamps
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)


# Create indexes
Index('idx_scraping_jobs_status', ScrapingJob.status)
Index('idx_scraping_jobs_created_at', ScrapingJob.created_at)
Index('idx_scraping_jobs_url', ScrapingJob.url)