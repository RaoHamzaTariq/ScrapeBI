from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID


class RenderStrategy(str, Enum):
    AUTO = "auto"
    FIXED_DELAY = "fixed_delay"
    WAIT_FOR_ELEMENT = "wait_for_element"


class ScrapingJobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMEOUT = "timeout"


class JobCreate(BaseModel):
    url: str = Field(..., description="URL to scrape")
    wait_time: int = Field(default=0, ge=0, le=60, description="Wait time in seconds (0-60)")
    render_strategy: RenderStrategy = Field(default=RenderStrategy.AUTO, description="How to wait for page rendering")
    wait_for_selector: Optional[str] = Field(default=None, description="CSS selector to wait for (when render_strategy is wait_for_element)")
    extract_text: bool = Field(default=True, description="Whether to extract text content")
    extract_html: bool = Field(default=True, description="Whether to extract HTML content")
    capture_screenshot: bool = Field(default=True, description="Whether to capture screenshot")

    @field_validator('url')
    def validate_url_format(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v


class JobResponse(BaseModel):
    id: UUID
    url: str
    status: ScrapingJobStatus
    created_at: datetime
    updated_at: datetime
    wait_time: int
    render_strategy: RenderStrategy
    wait_for_selector: Optional[str]
    extract_text: bool
    extract_html: bool
    capture_screenshot: bool
    screenshot_path: Optional[str]
    html_path: Optional[str]
    text_content: Optional[str]
    page_title: Optional[str]
    final_url: Optional[str]
    http_status: Optional[int]
    error_message: Optional[str]
    retry_count: int
    started_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class PaginatedJobList(BaseModel):
    items: List[JobResponse]
    total: int
    page: int
    limit: int
    pages: int


class JobStatusUpdate(BaseModel):
    job_id: UUID
    status: ScrapingJobStatus
    message: Optional[str] = None
    progress: Optional[int] = None


class JobStatus(BaseModel):
    job_id: UUID
    status: ScrapingJobStatus
    message: Optional[str] = None
    progress: Optional[int] = None
    timestamp: datetime