# Configuration Guide

Customize ScrapeBI settings for your specific needs.

## Table of Contents

- [Overview](#overview)
- [Application Settings](#application-settings)
- [Environment Variables](#environment-variables)
- [Browser Configuration](#browser-configuration)
- [Server Configuration](#server-configuration)
- [Advanced Configuration](#advanced-configuration)

## Overview

ScrapeBI is designed to work out of the box with sensible defaults. However, you can customize various settings to optimize for your use case.

### Configuration Files

```
ScrapeBI/
├── app.py              # Main application (server settings)
├── run.py              # Runner script
├── requirements.txt    # Python dependencies
└── .env                # Environment variables (create if needed)
```

### Default Values

| Setting | Default | Location |
|---------|---------|----------|
| Port | 5000 | app.py |
| Host | 0.0.0.0 | app.py |
| Debug Mode | True | app.py |
| Wait Time | 3 seconds | UI default |
| Session Timeout | Until restart | In-memory |

## Application Settings

### Flask Server Settings

**Location:** `app.py`

**Default Configuration:**
```python
app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
```

**Customize Port:**
```python
# Change from 5000 to 5001
app.run(debug=True, host='0.0.0.0', port=5001, threaded=True)
```

**Customize Host:**
```python
# Localhost only (more secure)
app.run(debug=True, host='127.0.0.1', port=5000)

# All interfaces (default)
app.run(debug=True, host='0.0.0.0', port=5000)
```

**Debug Mode:**
```python
# Development (with auto-reload)
app.run(debug=True, port=5000)

# Production (no auto-reload)
app.run(debug=False, port=5000)
```

### Selenium Settings

**Location:** `app.py` - `SeleniumScraper` class

**Default Chrome Options:**
```python
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1920,1080')
chrome_options.add_argument('--user-agent=Mozilla/5.0...')
```

**Customize Window Size:**
```python
# Smaller window
chrome_options.add_argument('--window-size=1280,720')

# Larger window
chrome_options.add_argument('--window-size=2560,1440')
```

**Headless Mode:**
```python
# Run Chrome without UI
chrome_options.add_argument('--headless')

# Headless with new Chrome
chrome_options.add_argument('--headless=new')
```

## Environment Variables

### Creating .env File

Create a `.env` file in the project root:

```bash
# .env
FLASK_ENV=development
FLASK_PORT=5000
DEFAULT_WAIT_TIME=3
```

### Supported Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `development` | Flask environment mode |
| `FLASK_PORT` | `5000` | Server port number |
| `FLASK_DEBUG` | `True` | Enable debug mode |
| `DEFAULT_WAIT_TIME` | `3` | Default wait time in seconds |
| `CHROME_HEADLESS` | `False` | Run Chrome in headless mode |

### Loading Environment Variables

**Using python-dotenv:**

```bash
pip install python-dotenv
```

**In app.py:**
```python
from dotenv import load_dotenv
load_dotenv()

# Get variable
import os
port = int(os.getenv('FLASK_PORT', 5000))
```

## Browser Configuration

### ChromeDriver Settings

**Auto-Installation:**
ScrapeBI uses webdriver-manager which auto-downloads ChromeDriver.

**Manual ChromeDriver:**
```python
from selenium.webdriver.chrome.service import Service

# Specify ChromeDriver path
service = Service('/path/to/chromedriver')
driver = webdriver.Chrome(service=service)
```

### Chrome Options

**Common Options:**
```python
# Disable automation detection
chrome_options.add_argument('--disable-blink-features=AutomationControlled')
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

# Set user agent
chrome_options.add_argument('--user-agent=Mozilla/5.0...')

# Disable features
chrome_options.add_argument('--disable-notifications')
chrome_options.add_argument('--disable-extensions')
```

**Proxy Configuration:**
```python
# Set proxy
chrome_options.add_argument('--proxy-server=http://proxy:port')

# Proxy with authentication
chrome_options.add_argument('--proxy-server=http://username:password@proxy:port')
```

## Server Configuration

### Production Deployment

**Disable Debug Mode:**
```python
app.run(debug=False, host='0.0.0.0', port=5000)
```

**Use WSGI Server:**
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Use Waitress (Windows-friendly):**
```bash
# Install waitress
pip install waitress

# Run with waitress
waitress-serve --port=5000 app:app
```

### SSL/HTTPS Configuration

**For Production:**

```python
# With Flask (development)
app.run(ssl_context=('cert.pem', 'key.pem'))

# With Gunicorn
gunicorn --certfile=cert.pem --keyfile=key.pem app:app
```

**Generate Self-Signed Cert:**
```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365
```

## Advanced Configuration

### Session Management

**Current Implementation:**
- Sessions stored in memory
- No expiration (persist until restart)
- No session limit

**Custom Session Timeout:**
```python
# Add to app.py
import time
from datetime import datetime, timedelta

SESSION_TIMEOUT = 3600  # 1 hour

def cleanup_expired_sessions():
    now = time.time()
    expired = [sid for sid, data in scraped_data_store.items() 
               if now - data.get('timestamp', 0) > SESSION_TIMEOUT]
    for sid in expired:
        del scraped_data_store[sid]
```

### Storage Configuration

**Current:** In-memory storage

**File-based Storage:**
```python
import json
import os

DATA_DIR = 'scraped_data'
os.makedirs(DATA_DIR, exist_ok=True)

def save_session(session_id, data):
    filepath = os.path.join(DATA_DIR, f'{session_id}.json')
    with open(filepath, 'w') as f:
        json.dump(data, f)

def load_session(session_id):
    filepath = os.path.join(DATA_DIR, f'{session_id}.json')
    with open(filepath, 'r') as f:
        return json.load(f)
```

### Logging Configuration

**Add Logging:**
```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrapebi.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Use in code
logger.info('Scraping started')
logger.error('Scraping failed')
```

### Rate Limiting

**Add Rate Limiting:**
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/scrape', methods=['POST'])
@limiter.limit("20 per minute")
def api_scrape():
    # ... existing code
```

## Performance Tuning

### Thread Pool Configuration

**For Concurrent Requests:**
```python
# In app.py
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=10)

@app.route('/api/scrape', methods=['POST'])
def api_scrape():
    future = executor.submit(scrape_url, url, wait_time)
    # Handle async
```

### Memory Optimization

**Limit Session Count:**
```python
MAX_SESSIONS = 100

def enforce_session_limit():
    while len(scraped_data_store) > MAX_SESSIONS:
        oldest = min(scraped_data_store.keys())
        del scraped_data_store[oldest]
```

### Cache Configuration

**Cache Scraped Pages:**
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_cached_html(url):
    # Return cached HTML if available
    pass
```

## Troubleshooting Configuration

### Port Already in Use

**Error:** `Address already in use`

**Solutions:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port
app.run(port=5001)
```

### ChromeDriver Issues

**Error:** `ChromeDriver not found`

**Solutions:**
```python
# webdriver-manager should auto-install
# If not, manually install:

# Windows
pip install webdriver-manager
# ChromeDriver downloads automatically

# Or download manually from:
# https://chromedriver.chromium.org/
```

### Memory Errors

**Error:** Out of memory

**Solutions:**
1. Reduce concurrent scrapes
2. Clear old sessions
3. Export and delete results
4. Increase system RAM

## Configuration Checklist

### Basic Setup
- [ ] Set appropriate port
- [ ] Configure host (localhost vs 0.0.0.0)
- [ ] Set debug mode (True for dev, False for prod)
- [ ] Configure wait time default

### Browser Setup
- [ ] Ensure Chrome installed
- [ ] Verify ChromeDriver working
- [ ] Set window size if needed
- [ ] Configure headless if needed

### Production Setup
- [ ] Disable debug mode
- [ ] Use WSGI server
- [ ] Configure SSL if needed
- [ ] Set up logging
- [ ] Add rate limiting
- [ ] Configure session cleanup

---

**Next:** Learn about [Testing](testing.md) ScrapeBI functionality.
