from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.v1 import jobs, results
from .config import settings
from .core.exceptions import ScrapingError
from .worker import celery_app as celery_worker
import uvicorn
import logging


def create_app():
    app = FastAPI(
        title="ScrapeFlow API",
        version="1.0.0",
        description="No-Code Web Scraping Platform API"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify exact origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(jobs.router, prefix="/api/v1", tags=["jobs"])
    app.include_router(results.router, prefix="/api/v1/jobs", tags=["results"])

    # Event handlers
    @app.on_event("startup")
    async def startup_event():
        # Initialize the storage service
        from .services.storage import storage_service
        await storage_service.init_bucket()
        print("Storage service initialized")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "backend"}

    # Exception handlers
    @app.exception_handler(ScrapingError)
    async def handle_scraping_error(request: Request, exc: ScrapingError):
        return JSONResponse(
            status_code=400,
            content={"detail": exc.message, "error_code": exc.error_code}
        )

    @app.exception_handler(ValueError)
    async def handle_value_error(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)