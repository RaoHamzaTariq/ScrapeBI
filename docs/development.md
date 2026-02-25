# Development Setup Guide

Set up your development environment for contributing to ScrapeBI.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Tools](#development-tools)
- [Running in Development](#running-in-development)
- [Debugging](#debugging)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.8+ | Backend runtime |
| Git | Latest | Version control |
| Google Chrome | Latest | Browser for scraping |
| pip | Latest | Python package manager |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Postman | API testing |
| Chrome DevTools | Debugging |
| Git GUI client | Visual git |

---

## Initial Setup

### 1. Clone Repository

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ScrapeBI.git
cd ScrapeBI

# Add upstream remote
git remote add upstream https://github.com/RaoHamzaTariq/ScrapeBI.git

# Verify remotes
git remote -v
```

### 2. Create Virtual Environment

```bash
# Create venv
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
# Core dependencies
pip install -r requirements.txt

# Development dependencies
pip install pytest pytest-cov black flake8 mypy

# Optional: Watchdog for auto-reload
pip install watchdog
```

### 4. Verify Installation

```bash
# Check Python packages
pip list

# Run tests
pytest

# Check code style
black --check .
flake8
```

---

## Development Tools

### Code Editor Setup

#### VS Code

**Recommended Extensions:**
```
- Python (Microsoft)
- Pylance (Microsoft)
- Black Formatter (Microsoft)
- GitLens (GitKraken)
- Live Server (Ritwick Dey)
- Thunder Client (API testing)
```

**Settings (settings.json):**
```json
{
    "python.defaultInterpreterPath": "./venv/bin/python",
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "black",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": true
    }
}
```

### Git Configuration

```bash
# Set user info
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch
git config --global init.defaultBranch main

# Set up SSH (optional but recommended)
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### Pre-commit Hooks

**Install pre-commit:**
```bash
pip install pre-commit
pre-commit install
```

**Create .pre-commit-config.yaml:**
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
  
  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
  
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
```

---

## Running in Development

### Start Development Server

```bash
# Activate venv first
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run with auto-reload
python run.py

# Or directly with Flask
python app.py
```

### Development Mode Features

- **Auto-reload:** Code changes restart server
- **Debug console:** Interactive debugging
- **Detailed errors:** Full stack traces
- **Profiler:** Performance insights

### Environment Variables for Development

Create `.env` file:
```bash
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
DEFAULT_WAIT_TIME=3
```

Load in app.py:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## Debugging

### Flask Debug Mode

**Enable in app.py:**
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

**Features:**
- Auto-reload on changes
- Interactive debugger
- Detailed error pages

### Python Debugger

**Using pdb:**
```python
import pdb

def scrape_url(url, wait_time):
    pdb.set_trace()  # Breakpoint
    # ... rest of code
```

**Commands:**
- `n` - Next line
- `s` - Step into
- `c` - Continue
- `q` - Quit
- `p variable` - Print variable

**Using breakpoint() (Python 3.7+):**
```python
def function():
    breakpoint()  # Modern breakpoint
    # ... code
```

### Browser DevTools

**Access:**
- Press F12 in browser
- Or Right-click → Inspect

**Useful for:**
- Inspecting elements
- Testing selectors
- Network monitoring
- Console debugging

**Test selectors in console:**
```javascript
// CSS Selector
document.querySelectorAll('.product-title')

// XPath
document.evaluate('//h1', document, null, 
  XPathResult.ANY_TYPE, null)
```

### Logging

**Setup logging:**
```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Use in code
logger.debug('Debug info')
logger.info('General info')
logger.warning('Warning')
logger.error('Error occurred')
```

---

## Building for Production

### Disable Debug Mode

```python
# app.py
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
```

### Use Production Server

**Gunicorn (Linux/macOS):**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Waitress (Windows):**
```bash
pip install waitress
waitress-serve --port=5000 app:app
```

**uWSGI:**
```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app
```

### Environment Variables for Production

```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<random-secret-key>
DATABASE_URL=<if-using-db>
```

### Security Checklist

- [ ] Debug mode disabled
- [ ] Secret key set
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] HTTPS configured
- [ ] Error pages customized
- [ ] Logging configured
- [ ] Dependencies updated

---

## Deployment

### Deploy to Heroku

**1. Create Heroku app:**
```bash
heroku login
heroku create scrapebi-app
```

**2. Create Procfile:**
```
web: gunicorn app:app
```

**3. Create runtime.txt:**
```
python-3.10.0
```

**4. Deploy:**
```bash
git add .
git commit -m "Prepare for Heroku"
git push heroku main
```

### Deploy to AWS

**Using EC2:**
```bash
# SSH to instance
ssh -i key.pem ec2-user@instance-ip

# Clone repo
git clone https://github.com/.../ScrapeBI.git
cd ScrapeBI

# Set up Python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Start with systemd
sudo nano /etc/systemd/system/scrapebi.service
```

**Service file:**
```ini
[Unit]
Description=ScrapeBI
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/ScrapeBI
ExecStart=/home/ec2-user/ScrapeBI/venv/bin/gunicorn -w 4 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### Deploy with Docker

**Create Dockerfile:**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

**Build and run:**
```bash
docker build -t scrapebi .
docker run -p 5000:5000 scrapebi
```

**Docker Compose:**
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/app
    environment:
      - FLASK_ENV=production
```

---

## Performance Optimization

### Profiling

**Using cProfile:**
```python
import cProfile
import pstats

@cProfile.profile('sort', 'cumulative')
def scrape_url(url, wait_time):
    # ... code
```

**Run with profiling:**
```bash
python -m cProfile -o output.prof app.py
python -m pstats output.prof
```

### Caching

**Flask-Caching:**
```bash
pip install Flask-Caching
```

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.cached(timeout=300)
def get_scraped_data(url):
    # ... code
```

### Database Integration (Future)

**SQLAlchemy setup:**
```bash
pip install flask-sqlalchemy
```

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scrapebi.db'
db = SQLAlchemy(app)

class ScrapedData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500))
    data = db.Column(db.JSON)
```

---

## Troubleshooting Development

### Common Issues

**Port already in use:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

**Import errors:**
```bash
# Ensure venv activated
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**ChromeDriver issues:**
```bash
# Clear webdriver-manager cache
# Windows: C:\Users\<user>\.wdm
# macOS/Linux: ~/.wdm

# Reinstall
pip uninstall webdriver-manager
pip install webdriver-manager
```

### Getting Help

- Check [Troubleshooting Guide](troubleshooting.md)
- Review [FAQ](faq.md)
- Search GitHub Issues
- Ask in Discussions

---

**Next:** Read [Contributing Guide](contributing.md) for contribution guidelines.
