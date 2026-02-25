# Installation Guide

This guide will walk you through installing ScrapeBI on your system.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Windows Installation](#windows-installation)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Verifying Installation](#verifying-installation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing ScrapeBI, ensure you have:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Google Chrome** - [Download Chrome](https://www.google.com/chrome/)
- **pip** (Python package manager) - Usually included with Python
- **Git** (optional) - For cloning the repository

### Check Python Version

Open a terminal/command prompt and run:

```bash
python --version
```

Or on some systems:

```bash
python3 --version
```

You should see Python 3.8 or higher.

## Installation Steps

### 1. Download ScrapeBI

**Option A: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location

**Option B: Clone Repository**
```bash
git clone https://github.com/RaoHamzaTariq/ScrapeBI.git
cd ScrapeBI
```

### 2. Navigate to Project Directory

```bash
cd ScrapeBI
```

### 3. Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- Selenium (browser automation)
- webdriver-manager (ChromeDriver management)
- BeautifulSoup4 (HTML parsing)
- lxml (XML/HTML parser)
- pandas (data handling)
- requests (HTTP library)

## Windows Installation

### Step-by-Step for Windows

1. **Install Python**
   - Download from [python.org](https://www.python.org/downloads/)
   - During installation, check "Add Python to PATH"

2. **Install Google Chrome**
   - Download from [google.com/chrome](https://www.google.com/chrome/)

3. **Open Command Prompt**
   - Press `Win + R`, type `cmd`, press Enter

4. **Navigate to Project**
   ```cmd
   cd C:\path\to\ScrapeBI
   ```

5. **Install and Run**
   ```cmd
   python run.py
   ```

### Using the Batch File

Simply double-click `start.bat` to launch ScrapeBI.

## macOS Installation

### Step-by-Step for macOS

1. **Install Python**
   ```bash
   brew install python3
   ```

2. **Install Google Chrome**
   ```bash
   brew install --cask google-chrome
   ```

3. **Open Terminal**
   - Applications → Utilities → Terminal

4. **Navigate to Project**
   ```bash
   cd /path/to/ScrapeBI
   ```

5. **Install and Run**
   ```bash
   python3 run.py
   ```

### Using the Shell Script

```bash
chmod +x start.sh
./start.sh
```

## Linux Installation

### Step-by-Step for Linux

1. **Install Python**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   ```

2. **Install Google Chrome**
   ```bash
   wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
   sudo dpkg -i google-chrome-stable_current_amd64.deb
   ```

3. **Install Dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

4. **Run ScrapeBI**
   ```bash
   python3 run.py
   ```

## Verifying Installation

After installation, verify everything works:

1. **Run the Application**
   ```bash
   python run.py
   ```

2. **Check the Console**
   You should see:
   ```
   ============================================================
   ScrapeBI - No-Code Web Scraping Tool
   ============================================================
   Starting server at http://localhost:5000
   Press Ctrl+C to stop
   ============================================================
   ```

3. **Open Browser**
   Your browser should automatically open to `http://localhost:5000`

4. **Test Scraping**
   - Enter a URL (e.g., `https://example.com`)
   - Click "Scrape"
   - Verify the page loads in the preview

## Troubleshooting

### Python Not Found

**Problem:** `python: command not found`

**Solution:**
- Ensure Python is installed
- Add Python to your system PATH
- Try `python3` instead of `python`

### Permission Denied

**Problem:** `Permission denied` when running scripts

**Solution (macOS/Linux):**
```bash
chmod +x start.sh
chmod +x run.py
```

### Module Not Found

**Problem:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
pip install -r requirements.txt
```

### ChromeDriver Issues

**Problem:** ChromeDriver errors

**Solution:**
- The webdriver-manager will auto-install ChromeDriver
- Ensure Google Chrome is installed
- Update Chrome to the latest version

### Port Already in Use

**Problem:** `Address already in use` error

**Solution:**
- Close any other applications using port 5000
- Or modify the port in `app.py`:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```

## Next Steps

Once installed successfully:
- Read the [Quick Start Guide](quickstart.md)
- Try the [First Scraper Tutorial](first-scraper.md)
- Explore the [Basic Usage Guide](basic-usage.md)

---

**Having trouble?** Check the [Troubleshooting Guide](troubleshooting.md) or open an issue on GitHub.
