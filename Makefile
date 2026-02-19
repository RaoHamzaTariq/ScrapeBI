# Makefile for ScrapeBI
# Common commands for development and production

.PHONY: up down logs shell migrate worker flower test test-backend test-frontend test-integration clean

# Default target
help:
	@echo "ScrapeBI Makefile"
	@echo "==================="
	@echo "up          - Start all services in detached mode"
	@echo "down        - Stop all services"
	@echo "logs        - View logs from all services"
	@echo "logs-f      - View logs in follow mode"
	@echo "shell       - Open shell in backend container"
	@echo "migrate     - Run database migrations"
	@echo "worker      - View worker logs"
	@echo "flower      - Open Flower monitoring (if available)"
	@echo "test        - Run all tests"
	@echo "test-backend - Run backend tests"
	@echo "test-frontend - Run frontend tests"
	@echo "test-integration - Run integration tests"
	@echo "clean       - Stop all services and remove volumes"
	@echo "backup      - Backup database"
	@echo "restore     - Restore database from backup"

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs from all services
logs:
	docker-compose logs

# View logs in follow mode
logs-f:
	docker-compose logs -f

# Open shell in backend container
shell:
	docker-compose exec backend bash

# Run database migrations
migrate:
	docker-compose exec backend alembic upgrade head

# View worker logs
worker:
	docker-compose logs -f worker

# Open Flower monitoring
flower:
	@echo "Flower monitoring available at: http://localhost:5555"
	@echo "Opening browser..."
	@xdg-open http://localhost:5555 2>/dev/null || open http://localhost:5555 2>/dev/null || echo "Please open http://localhost:5555 in your browser"

# Run tests (if applicable)
test:
	docker-compose exec backend pytest

# Run all tests
test:
	@echo "Running all tests..."
	cd backend && pytest
	cd frontend && npm test

# Run backend tests
test-backend:
	@echo "Running backend tests..."
	cd backend && pytest

# Run frontend tests
test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm test

# Run integration tests
test-integration:
	@echo "Running backend integration tests..."
	cd backend && pytest tests/integration/

# Clean up - stop services and remove volumes
clean:
	docker-compose down -v

# Backup database
backup:
	@echo "Creating database backup..."
	docker-compose exec db pg_dump -U user -d scraping > backup_$$(date +%Y%m%d_%H%M%S).sql

# Restore database from backup
restore:
	@echo "Enter backup file name to restore from:"
	@read backup_file; \
	docker-compose exec -T db psql -U user -d scraping < $${backup_file}

# Rebuild services
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Reset everything (use with caution)
reset:
	docker-compose down -v
	docker volume prune -f
	docker system prune -f