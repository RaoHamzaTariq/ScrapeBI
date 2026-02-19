import json
import logging
import uuid
import time
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.v1 import jobs, results
from .config import settings
from .core.exceptions import ScrapingError
from .worker import celery_app as celery_worker
from .database import engine
from .services.storage import storage_service
import uvicorn
import structlog
from prometheus_client import make_asgi_app, Counter, Histogram
import asyncio

# Set up structured logging with structlog
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger("scrapeflow")

# Metrics for monitoring
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

def create_app():
    app = FastAPI(
        title="ScrapeFlow API",
        version="1.0.0",
        description="No-Code Web Scraping Platform API"
    )

    # Add Prometheus metrics endpoint
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

    # Add CORS middleware with specific allowed origins in production
    allowed_origins = ["*"]  # For development
    if settings.allowed_origins:
        allowed_origins = [origin.strip() for origin in settings.allowed_origins.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request timing and correlation ID middleware
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.time()
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        structlog.contextvars.bind_contextvars(correlation_id=correlation_id)

        response = await call_next(request)

        process_time = time.time() - start_time
        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(process_time)

        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()

        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Correlation-ID"] = correlation_id

        structlog.contextvars.clear_contextvars()
        return response

    # Include API routes
    app.include_router(jobs.router, prefix="/api/v1", tags=["jobs"])
    app.include_router(results.router, prefix="/api/v1/jobs", tags=["results"])

    # Startup event
    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting up ScrapeFlow API")

        # Test database connection
        try:
            async with engine.begin() as conn:
                # This will test the connection
                await conn.execute("SELECT 1")
            logger.info("Database connection successful")
        except Exception as e:
            logger.error("Database connection failed", error=str(e))
            raise

        # Initialize storage service
        try:
            await storage_service.init_bucket()
            logger.info("Storage service initialized")
        except Exception as e:
            logger.error("Storage service initialization failed", error=str(e))
            raise

    # Shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Shutting down ScrapeFlow API")

        # Gracefully shutdown - finish active jobs, close connections
        try:
            # Perform any necessary cleanup here
            # For example, disconnect from database pools
            await engine.dispose()
            logger.info("Database engine disposed")
        except Exception as e:
            logger.error("Error during shutdown", error=str(e))

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "backend", "timestamp": datetime.utcnow().isoformat()}

    # Exception handlers
    @app.exception_handler(ScrapingError)
    async def handle_scraping_error(request: Request, exc: ScrapingError):
        logger.error("Scraping error occurred", error=exc.message, error_code=exc.error_code)
        return JSONResponse(
            status_code=400,
            content={"detail": exc.message, "error_code": exc.error_code}
        )

    @app.exception_handler(ValueError)
    async def handle_value_error(request: Request, exc: ValueError):
        logger.error("Value error occurred", error=str(exc))
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )

    # Global exception handler for unhandled exceptions
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error("Unhandled exception occurred", error=str(exc), traceback=str(exc.__traceback__))
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)