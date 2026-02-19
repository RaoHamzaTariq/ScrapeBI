# ScrapeBI - No-Code Web Scraping Platform

A production-ready, no-code web scraping system where non-technical users enter a URL and receive fully rendered page data (HTML, text, screenshot) through an automated browser session.

## 🚀 Features

- **Zero-code experience**: Users never write code
- **Production-ready**: Proper error handling, retries, monitoring
- **Scalable**: Queue-based architecture allowing horizontal worker scaling
- **Containerized**: Single `docker-compose up` deployment
- **Real-time monitoring**: Job status updates with SSE
- **Admin interface**: Flower monitoring for Celery tasks
- **Metrics**: Prometheus integration for monitoring

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Browser Automation**: Playwright
- **Database**: PostgreSQL 15
- **Queue**: Redis + Celery
- **Storage**: MinIO (S3-compatible)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Flower for Celery

## 📋 Requirements

- Docker Engine (20.10.0+)
- Docker Compose (v2+)
- Make (optional, for convenience commands)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd scrapebi
```

### 2. Set up environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Start the application
```bash
make up
# or
docker-compose up -d
```

### 4. Initialize the database
```bash
make migrate
# or
docker-compose exec backend alembic upgrade head
```

### 5. Access the application
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health
- **Metrics**: http://localhost:8000/metrics
- **Flower Monitoring**: http://localhost:5555
- **MinIO Console**: http://localhost:9001 (admin:minioadmin)

## 🛠️ Development Commands

```bash
make up           # Start all services in detached mode
make down         # Stop all services
make logs         # View logs from all services
make logs-f       # View logs in follow mode
make shell        # Open shell in backend container
make migrate      # Run database migrations
make worker       # View worker logs
make flower       # Open Flower monitoring
make test         # Run tests (if applicable)
make clean        # Stop all services and remove volumes
make rebuild      # Rebuild services with no cache
```

## 🏗️ Architecture

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

## 📊 API Endpoints

### Jobs API
- `POST /api/v1/jobs` - Create scraping job
- `GET /api/v1/jobs/{id}` - Get job status/results
- `GET /api/v1/jobs/{id}/stream` - SSE for real-time updates
- `DELETE /api/v1/jobs/{id}` - Cancel job (if pending)
- `GET /api/v1/jobs` - List jobs (pagination)

### Results API
- `GET /api/v1/jobs/{id}/download/{type}` - Download HTML/text/screenshot
- `GET /api/v1/jobs/{id}/preview` - Inline preview (for iframe)

## 📁 Project Structure

```
scrapebi/
├── docker-compose.yml
├── .env.example
├── Makefile
├── nginx/
│   └── nginx.conf
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tasks/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json
    └── .dockerignore
```

## 🧪 Environment Variables

### Backend (.env)
```bash
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
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://backend:8000
```

## 🛡️ Security Features

- URL validation (prevents file://, localhost, internal IPs)
- Rate limiting (Redis-based, per-IP)
- File size limits (screenshot max 10MB)
- Content Security Policy headers
- No SSRF vulnerabilities
- Input validation and sanitization

## 📈 Production Features

- **Monitoring**: Prometheus metrics and Flower for Celery
- **Logging**: Structured JSON logging with correlation IDs
- **Security**: HTTPS-ready configuration, security headers
- **Performance**: Gzip compression, caching, optimized assets
- **Reliability**: Health checks, graceful shutdowns, retry logic
- **Resource management**: Docker resource limits and monitoring

## 🔧 Configuration

All services have been configured with production-ready defaults:

- **PostgreSQL**: 512MB memory limit, 0.5 CPU
- **Redis**: 256MB memory limit, 0.25 CPU
- **MinIO**: 512MB memory limit, 0.5 CPU
- **Backend**: 1GB memory limit, 1 CPU
- **Worker**: 2GB memory limit, 1 CPU
- **Frontend**: 512MB memory limit, 0.5 CPU
- **Nginx**: 128MB memory limit, 0.25 CPU

## 🐛 Troubleshooting

### Common Issues

1. **Playwright Browser Issues**:
   ```bash
   docker-compose exec backend playwright install chromium --with-deps
   ```

2. **Database Connection Issues**:
   - Check PostgreSQL is running: `docker-compose logs db`
   - Verify credentials in environment variables

3. **MinIO Access Issues**:
   - Ensure MinIO is running: `docker-compose logs minio`
   - Check MinIO credentials and bucket creation

4. **Frontend-Backend Communication**:
   - Verify API endpoints are accessible
   - Check CORS configuration in backend

### View Logs
```bash
# View all logs
make logs

# View specific service
docker-compose logs backend
docker-compose logs worker
docker-compose logs frontend
```

## 🚀 Deployment

For production deployment:

1. Update environment variables with secure values
2. Configure SSL certificates in nginx/nginx.conf
3. Set up proper domain names
4. Configure backup strategies for PostgreSQL and MinIO
5. Set up monitoring and alerting

## 📄 License

MIT