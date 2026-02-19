# No-Code Web Scraping Platform

## Role: 
You are my Assistant and your name is "Leadia" and your task is to help me to create this project

## Project Overview
Building "ScrapeBI" - a production-ready no-code web scraping system where non-technical users enter a URL and receive fully rendered page data (HTML, text, screenshot) through an automated browser session.

## Core Philosophy
- **Zero-code experience**: Users never write code
- **Production-ready**: Not a prototype - proper error handling, retries, monitoring
- **Scalable**: Queue-based architecture allowing horizontal worker scaling
- **Containerized**: Single `docker-compose up` deployment

## Technology Stack (Locked)

### Backend
- **Framework**: FastAPI (Python 3.11+)
  - Async-native, automatic OpenAPI docs, excellent Playwright integration
- **Browser Automation**: Playwright (over Selenium)
  - Better async support, auto-wait mechanisms, faster execution, modern browser APIs
- **Database**: PostgreSQL 15
  - JSONB for flexible metadata, ACID compliance, proven reliability
- **Queue**: Redis + Celery (or RQ)
  - Celery: mature, battle-tested, proper retry logic, monitoring (Flower)
- **Storage**: MinIO (S3-compatible) for screenshots/HTML files
  - Keeps DB light, scalable object storage

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Query (TanStack Query) for server state
- **UI Requirements**:
  - Clean, professional interface
  - Real-time job status updates (SSE or polling)
  - Tabbed results view (Screenshot, Text, HTML)
  - Export functionality

## Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Next.js   │──────│   FastAPI    │──────│  PostgreSQL │
│   Frontend  │      │    API       │      │   (Jobs)    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Redis     │
                     │    Queue     │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Celery     │
                     │   Workers    │
                     └──────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
              ┌─────────┐     ┌─────────┐
              │Playwright│     │  MinIO  │
              │ Browser │     │Storage  │
              └─────────┘     └─────────┘
```

## Data Models

### Job Model (PostgreSQL)
```python
class ScrapingJob:
    id: UUID (PK)
    url: str (validated URL)
    status: enum [pending, running, completed, failed, timeout]
    created_at: datetime
    updated_at: datetime
    wait_time: int (seconds, 0-60)
    render_strategy: enum [auto, fixed_delay, wait_for_element]
    wait_for_selector: str | null (CSS selector if strategy=wait_for_element)
    extract_text: bool
    extract_html: bool
    capture_screenshot: bool
    
    # Results (stored in MinIO, references here)
    screenshot_path: str | null
    html_path: str | null
    text_content: text | null (stored in DB if <100KB, else MinIO)
    
    # Metadata
    page_title: str | null
    final_url: str | null (after redirects)
    http_status: int | null
    error_message: str | null
    retry_count: int (default 0)
    started_at: datetime | null
    completed_at: datetime | null
```

## API Endpoints

### Jobs API
- `POST /api/v1/jobs` - Create scraping job
- `GET /api/v1/jobs/{id}` - Get job status/results
- `GET /api/v1/jobs/{id}/stream` - SSE for real-time updates
- `DELETE /api/v1/jobs/{id}` - Cancel job (if pending)
- `GET /api/v1/jobs` - List jobs (pagination)

### Results API
- `GET /api/v1/jobs/{id}/download/{type}` - Download HTML/text/screenshot
- `GET /api/v1/jobs/{id}/preview` - Inline preview (for iframe)

## Worker Logic (Celery Tasks)

### Task: scrape_website(job_id: UUID)
1. Fetch job from DB, update status to `running`
2. Launch Playwright browser (chromium, headless)
3. Apply blocking protection:
   - User-Agent rotation
   - Stealth plugins (playwright-stealth)
   - Request interception (block ads/trackers)
4. Navigate to URL with timeout (30s default)
5. Apply rendering strategy:
   - `auto`: Playwright's auto-wait (networkidle)
   - `fixed_delay`: Sleep for `wait_time`
   - `wait_for_element`: Wait for CSS selector
6. Extract data based on toggles:
   - Screenshot: Full page or viewport
   - HTML: page.content()
   - Text: inner_text extraction
7. Upload files to MinIO, update DB
8. Handle errors with retry logic:
   - Network errors: retry 2x with backoff
   - Timeout: mark as timeout
   - Browser crash: retry 1x
   - Validation errors: fail immediately

## Error Handling Strategy

### Retry Policy
- Max retries: 3
- Backoff: 5s, 15s, 45s (exponential)
- Retry on: NetworkError, TimeoutError, BrowserError
- No retry on: ValidationError, 4xx errors (except 429)

### Timeout Protection
- Job-level timeout: 5 minutes (Celery hard timeout)
- Navigation timeout: 30 seconds
- Rendering timeout: 60 seconds
- Worker heartbeat: kills zombie browsers

### Blocking Protection
- Rotate User-Agents
- Playwright stealth mode
- Block unnecessary resources (images, fonts if screenshot not needed)
- Proxy support (configurable per-job in future)

## File Storage Structure (MinIO)

```
scraping-bucket/
├── {job_id}/
│   ├── screenshot.png
│   ├── page.html
│   └── text.txt
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/scraping
REDIS_URL=redis://redis:6379/0
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=scraping-bucket
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
MAX_CONCURRENT_JOBS=5
DEFAULT_TIMEOUT=300
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://backend:8000
```

## Docker Services

1. **frontend**: Next.js dev server (port 3000)
2. **backend**: FastAPI app (port 8000)
3. **worker**: Celery worker process
4. **scheduler**: Celery beat (for cleanup tasks)
5. **db**: PostgreSQL 15
6. **redis**: Redis 7 (queue + cache)
7. **minio**: MinIO object storage (port 9000, 9001)
8. **nginx**: Reverse proxy (port 80) - optional for production

## Development Checkpoints

### Phase 1: Foundation
- [ ] Docker Compose setup with all services
- [ ] Backend project structure + DB models
- [ ] Basic FastAPI endpoints (CRUD jobs)

### Phase 2: Core Scraping
- [ ] Playwright integration
- [ ] Celery worker implementation
- [ ] MinIO storage integration
- [ ] Error handling + retries

### Phase 3: Frontend
- [ ] Next.js setup with shadcn/ui
- [ ] Job creation form
- [ ] Job status monitoring
- [ ] Results viewer with tabs

### Phase 4: Polish
- [ ] Real-time updates (SSE)
- [ ] Export functionality
- [ ] Input validation
- [ ] Loading states + error UI

### Phase 5: Production
- [ ] Health checks
- [ ] Resource limits
- [ ] Logging (structured JSON)
- [ ] Monitoring dashboard (Flower)

## Code Quality Standards

- **Backend**: 
  - Pydantic v2 for all validation
  - Type hints everywhere (mypy strict)
  - Async/await patterns only
  - pytest with 80%+ coverage
  
- **Frontend**:
  - Strict TypeScript
  - React Server Components where possible
  - Accessibility (ARIA labels)
  - Responsive design

## Security Considerations

- URL validation (prevent file://, localhost, internal IPs)
- Rate limiting (Redis-based, per-IP)
- File size limits (screenshot max 10MB)
- Content Security Policy headers
- No SSRF vulnerabilities

## Folder Structure

```
scrapebi/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── jobs.py
│   │   │       └── results.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── exceptions.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── job.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── job.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── scraping.py
│   │   │   └── storage.py
│   │   └── tasks/
│   │       ├── __init__.py
│   │       └── scrape.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic/ (migrations)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── jobs/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── api/
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── job-form.tsx
│   │   ├── job-status.tsx
│   │   └── results-viewer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── Dockerfile
│   └── package.json
└── nginx/
    └── nginx.conf
```

## Key Decisions Log

1. **Playwright over Selenium**: Better async support, auto-wait, faster, modern API
2. **Celery over RQ**: Mature ecosystem, Flower monitoring, better retry control
3. **MinIO over filesystem**: Scalable, S3-compatible, works in distributed setups
4. **PostgreSQL over Mongo**: ACID compliance, JSONB flexibility, existing Celery integration
5. **SSE over WebSockets**: Simpler for one-way server→client updates, works through proxies
