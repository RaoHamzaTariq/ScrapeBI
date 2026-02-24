#!/usr/bin/env python3
"""
ScrapeBI - Main Entry Point
Run this file to start the complete web scraping application
"""

import subprocess
import sys
import os
import webbrowser
import time
import signal

def print_banner():
    """Print application banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════════╗
    ║                                                                  ║
    ║              🕷️  ScrapeBI - No-Code Scraping Tool                ║
    ║                                                                  ║
    ║   A powerful web scraping tool with visual element selector     ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_dependencies():
    """Check if required dependencies are installed"""
    print("📦 Checking dependencies...")
    
    required_packages = [
        'flask', 'selenium', 'webdriver_manager', 'bs4', 'pandas', 'lxml'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('webdriver_manager', 'webdriver_manager.chrome').replace('bs4', 'bs4'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("📥 Installing missing dependencies...")
        
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
            print("✅ Dependencies installed successfully!\n")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error installing dependencies: {e}")
            print("Please run: pip install -r requirements.txt")
            sys.exit(1)
    else:
        print("✅ All dependencies are installed!\n")

def check_chrome():
    """Check if Chrome is installed"""
    print("🔍 Checking Chrome installation...")
    
    chrome_paths = [
        # Windows
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe",
        # macOS
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        # Linux
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
    ]
    
    chrome_found = False
    for path in chrome_paths:
        expanded_path = os.path.expandvars(path)
        if os.path.exists(expanded_path):
            chrome_found = True
            print(f"✅ Chrome found at: {expanded_path}\n")
            break
    
    if not chrome_found:
        print("⚠️  Chrome not found in standard locations.")
        print("   The webdriver-manager will attempt to download ChromeDriver automatically.\n")
    
    return chrome_found

def start_server():
    """Start the Flask server"""
    print("🚀 Starting ScrapeBI server...")
    print("-" * 60)
    
    try:
        # Import the Flask app
        from app import app, scraper
        
        # Open browser after a short delay
        def open_browser():
            time.sleep(2)
            webbrowser.open('http://localhost:5000')
        
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        print("🌐 Opening browser at http://localhost:5000")
        print("📋 Press Ctrl+C to stop the server")
        print("=" * 60 + "\n")
        
        # Start the Flask app
        app.run(debug=False, host='0.0.0.0', port=5000, threaded=True)
        
    except ImportError as e:
        print(f"❌ Error importing Flask app: {e}")
        print("Make sure app.py is in the same directory.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n\n👋 Shutting down ScrapeBI...")
    print("🧹 Cleaning up resources...")
    
    try:
        from app import scraper
        scraper.close()
        print("✅ WebDriver closed successfully")
    except:
        pass
    
    print("✅ Goodbye!")
    sys.exit(0)

def main():
    """Main function"""
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Print banner
    print_banner()
    
    # Check if we're in the right directory
    if not os.path.exists('app.py'):
        print("❌ Error: app.py not found!")
        print("Please run this script from the ScrapeBI directory.")
        sys.exit(1)
    
    # Check dependencies
    check_dependencies()
    
    # Check Chrome
    check_chrome()
    
    # Start the server
    start_server()

if __name__ == '__main__':
    main()
