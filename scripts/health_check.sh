#!/bin/bash
# Health check script for ScrapeFlow services

set -e

echo "Checking ScrapeFlow services health..."

# Check backend API
echo -n "Checking backend API... "
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    exit 1
fi

# Check frontend
echo -n "Checking frontend... "
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    exit 1
fi

# Check database connection
echo -n "Checking database connection... "
if docker-compose exec db pg_isready > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    exit 1
fi

# Check Redis
echo -n "Checking Redis... "
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    exit 1
fi

# Check MinIO
echo -n "Checking MinIO... "
if docker-compose exec minio mc admin info local > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    exit 1
fi

echo "All services are healthy! ✓"