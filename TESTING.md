# Testing Guide for ScrapeFlow

This document outlines the testing strategy and manual testing checklist for the ScrapeFlow no-code web scraping platform.

## Testing Strategy

### 1. Unit Tests
- Test individual functions and methods in isolation
- Focus on business logic without external dependencies
- Use mocking for external services (MinIO, Playwright, etc.)

### 2. Integration Tests
- Test the interaction between different components
- Verify API endpoints work correctly with the database
- Test complete workflows without mocking core services

### 3. End-to-End Tests
- Test complete user workflows
- Verify frontend and backend integration
- Test real-world usage scenarios

## Automated Tests

### Backend Tests
Located in `/backend/tests/`:

#### API Tests (`/test_api/`)
- `test_jobs.py`: Test all job-related endpoints
  - Job creation with various parameters
  - Job retrieval and listing
  - Job cancellation
  - Error handling for invalid requests

#### Service Tests (`/test_services/`)
- `test_scraping.py`: Test the scraping service with mocked Playwright
  - Different render strategies (auto, fixed delay, wait for element)
  - Content extraction (HTML, text, screenshots)
  - Error handling and retries
- `test_storage.py`: Test MinIO storage service
  - File upload and download
  - Bucket initialization
  - Presigned URL generation

#### Task Tests (`/test_tasks/`)
- `test_scrape.py`: Test Celery scraping tasks
  - Successful job execution
  - Error handling and failure scenarios
  - Retry logic
  - Status updates

#### Integration Tests (`/integration/`)
- `test_job_flow.py`: Test complete job workflows
  - End-to-end job processing
  - Error scenarios
  - File download functionality
  - Status updates

### Frontend Tests
Located in `/frontend/__tests__/`:

#### Component Tests (`/__tests__/components/`)
- `job-form.test.tsx`: Test the job creation form
  - Form validation
  - API integration
  - Loading and error states
- `job-status.test.tsx`: Test job status display
  - Status polling
  - Different status displays
  - Error handling

#### API Tests (`/__tests__/lib/`)
- `api.test.ts`: Test the API client layer
  - All API endpoint calls
  - Error handling
  - Response formatting

## Running Tests

### Backend Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-mock httpx pytest-cov factory-boy

# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api/test_jobs.py

# Run integration tests only
pytest tests/integration/

# Run with verbose output
pytest -v
```

### Frontend Tests
```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- job-form.test.tsx
```

### Docker-based Testing
You can also run tests using Docker:

```bash
# Start test services
docker-compose -f docker-compose.test.yml up -d

# Run backend tests in Docker container
docker-compose -f docker-compose.test.yml exec backend pytest tests/

# Stop test services
docker-compose -f docker-compose.test.yml down
```

## Manual Testing Checklist

### Pre-deployment Tests

- [ ] **Docker Compose Builds Successfully**
  - [ ] `docker-compose build` completes without errors
  - [ ] All services build successfully
  - [ ] No dependency conflicts

- [ ] **All Services Start Without Errors**
  - [ ] `docker-compose up -d` starts all services
  - [ ] All services show healthy status with `docker-compose ps`
  - [ ] No error logs in any service with `docker-compose logs <service>`

- [ ] **Database Connection**
  - [ ] PostgreSQL container is accessible
  - [ ] Database migration runs successfully
  - [ ] Can connect to database from backend

- [ ] **MinIO Storage**
  - [ ] MinIO container starts and is accessible
  - [ ] Bucket is created automatically
  - [ ] Storage service can connect to MinIO

- [ ] **Redis Queue**
  - [ ] Redis container is accessible
  - [ ] Celery workers can connect to Redis
  - [ ] Task queue operates correctly

- [ ] **Frontend-Backend Communication**
  - [ ] Frontend can reach backend API
  - [ ] CORS headers are properly set
  - [ ] API requests work from frontend

### Functional Tests

- [ ] **Can Create Job Via Frontend**
  - [ ] Job form renders correctly
  - [ ] Form validation works properly
  - [ ] Job submission succeeds
  - [ ] Job appears in job list

- [ ] **Job Processes and Completes**
  - [ ] Job status transitions from pending → running → completed
  - [ ] No errors during processing
  - [ ] Processing time is reasonable

- [ ] **Can View Results**
  - [ ] Screenshot displays correctly
  - [ ] Text content is readable
  - [ ] HTML content is properly formatted
  - [ ] All result tabs work correctly

- [ ] **Can Download All File Types**
  - [ ] Screenshot download works
  - [ ] HTML file download works
  - [ ] Text file download works
  - [ ] Downloaded files are not corrupted

### Error Handling Tests

- [ ] **Error Handling Works**
  - [ ] Invalid URL shows proper error message
  - [ ] Unreachable site shows appropriate error
  - [ ] Invalid form data shows validation errors
  - [ ] Error messages are user-friendly

- [ ] **Cancellation Works**
  - [ ] Can cancel pending jobs
  - [ ] Cannot cancel running/completed jobs
  - [ ] Cancellation updates job status correctly

- [ ] **SSE Updates Work in Real-time**
  - [ ] Job status updates in real-time
  - [ ] Progress indicators work correctly
  - [ ] No excessive polling occurs

- [ ] **Rate Limiting Works**
  - [ ] Rate limiting prevents excessive requests
  - [ ] Appropriate error messages when rate-limited
  - [ ] Rate limiting resets after cooldown period

- [ ] **Large Pages Handled Correctly**
  - [ ] Can process large HTML pages
  - [ ] Processing doesn't timeout for large pages
  - [ ] Memory usage stays reasonable
  - [ ] Screenshot quality is maintained for large pages

### Production Checks

- [ ] **Security Headers**
  - [ ] All security headers are present
  - [ ] XSS protection is active
  - [ ] Content Security Policy is enforced

- [ ] **Performance Under Load**
  - [ ] Can handle multiple concurrent jobs
  - [ ] Database performance stays acceptable
  - [ ] Memory usage remains stable
  - [ ] Response times stay reasonable

- [ ] **Monitoring and Logging**
  - [ ] Logs are structured and searchable
  - [ ] Error logs contain sufficient information
  - [ ] Metrics endpoint provides useful data
  - [ ] Flower monitoring shows task information

- [ ] **Backup and Recovery**
  - [ ] Database backup script works
  - [ ] File storage backup is possible
  - [ ] Restore procedures are documented and tested

### Browser Compatibility

- [ ] **Modern Browsers**
  - [ ] Works in latest Chrome
  - [ ] Works in latest Firefox
  - [ ] Works in latest Safari
  - [ ] Works in latest Edge

- [ ] **Responsive Design**
  - [ ] Form is usable on mobile devices
  - [ ] Results display properly on tablets
  - [ ] All UI elements are accessible

### API Testing

- [ ] **API Documentation**
  - [ ] Swagger/OpenAPI docs are accessible
  - [ ] API endpoints are properly documented
  - [ ] Example requests/responses are correct

- [ ] **Authentication (if implemented)**
  - [ ] Authentication works for protected endpoints
  - [ ] Unauthorized access is prevented
  - [ ] Token expiration is handled

## Test Data

### Sample URLs for Testing
- `https://httpbin.org/delay/2` - Test with delay
- `https://example.com` - Basic test page
- `https://httpbin.org/status/404` - Test error handling
- `https://httpbin.org/html` - Test HTML extraction
- `https://httpbin.org/json` - Test different content types

### Edge Cases to Test
- Very long URLs
- URLs with special characters
- URLs with authentication
- Pages with heavy JavaScript
- Pages with dynamic content loading
- Pages with anti-bot measures

## Performance Benchmarks

### Expected Performance
- Job creation: < 1 second
- Simple page scraping: < 10 seconds
- Complex page scraping: < 30 seconds
- File downloads: < 5 seconds
- API response times: < 500ms

### Resource Usage
- Backend memory: < 500MB per instance
- Database memory: < 200MB
- MinIO storage: Efficient file storage
- CPU usage: < 50% under normal load

## Troubleshooting Common Test Issues

### Failed Tests
1. Check if all Docker services are running
2. Verify database migrations are applied
3. Ensure test database is clean
4. Check for any mocking issues

### Performance Issues
1. Verify database indexing
2. Check for memory leaks
3. Review API call efficiency
4. Monitor system resources

### Integration Issues
1. Verify network connectivity between services
2. Check environment variable configuration
3. Confirm service startup order
4. Review CORS policy settings