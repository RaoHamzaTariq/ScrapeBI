# 🕷️ ScrapeBI - No-Code Web Scraping Tool

A powerful, user-friendly web scraping tool built with Python, Selenium, and Flask. Features a visual element selector that allows you to extract data from websites without writing any code.

<p align="center">
  <img src="public/logo.png" alt="ScrapeBI Logo" width="120">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ScrapeBI-v1.0-blue" alt="ScrapeBI">
  <img src="https://img.shields.io/badge/Python-3.8+-green" alt="Python">
  <img src="https://img.shields.io/badge/Flask-2.3.3-orange" alt="Flask">
  <img src="https://img.shields.io/badge/Selenium-4.15.2-red" alt="Selenium">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="License">
  <img src="https://img.shields.io/github/stars/yourusername/ScrapeBI?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/last-commit/yourusername/ScrapeBI" alt="Last commit">
</p>

## ✨ Features

- 🔍 **Visual Element Selector** - Click on elements in a live preview to select them
- 📋 **Element Detection** - Automatically detects and categorizes all page elements
- 🎯 **No-Code Extraction** - Create extraction rules with CSS selectors, XPath, or element properties
- 📊 **Multiple Export Formats** - Export data as JSON, CSV, or TXT
- 🖥️ **Modern UI** - Clean, responsive interface with real-time previews
- ⚡ **Quick Extract** - One-click extraction of common elements (headings, links, images, etc.)
- 💾 **Save Rules** - Save and reuse extraction rules across different pages
- 🔄 **Batch Processing** - Run multiple extraction rules at once

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Google Chrome browser (ChromeDriver will be auto-installed)

### Installation

1. **Extract the project files** to a folder

2. **Navigate to the project directory:**
```bash
cd ScrapeBI
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

Or simply run:
```bash
python run.py
```
The script will automatically check and install missing dependencies.

### Running the Application

**Option 1: Using the main runner (Recommended)**
```bash
python run.py
```

**Option 2: Using Flask directly**
```bash
python app.py
```

The application will:
- Start the Flask server at `http://localhost:5000`
- Automatically open your web browser
- Display the ScrapeBI interface

## 📖 How to Use

### 1. Scrape a Website

1. Enter the URL of the website you want to scrape
2. Set the wait time (how long to wait for the page to load)
3. Click the **"Scrape"** button

### 2. Visual Element Selector

- Switch to the **"Visual Selector"** tab
- See a live preview of the scraped page
- Hover over elements to highlight them
- Click on any element to select it
- View the element's details and create an extraction rule

### 3. Element List

- Switch to the **"Element List"** tab
- Browse elements organized by category:
  - Headings (H1-H6)
  - Links
  - Images
  - Paragraphs
  - Tables
  - Lists
  - Forms
  - Buttons
  - Input fields
- Click on any element to select it

### 4. Create Extraction Rules

1. Click **"Add Rule"** or select an element
2. Enter a name for the rule
3. Choose the selector type:
   - **CSS Selector** - Most common (e.g., `.class`, `#id`, `div > p`)
   - **XPath** - For complex selections
   - **Tag Name** - Select by HTML tag
   - **Class Name** - Select by class
   - **ID** - Select by ID
4. Enter the selector value
5. Choose what to extract:
   - Text Content
   - HTML Content
   - Href (for links)
   - Src (for images)
   - Alt text
   - Title attribute
   - And more...
6. Click **"Save Rule"**

### 5. Run Extraction

- Click the play button (▶) on any rule to run it
- Or click **"Run All Rules"** to execute all rules at once
- View results in the **"Results"** tab

### 6. Export Data

- Switch to the **"Results"** tab
- Click **JSON**, **CSV**, or **TXT** to export in your preferred format

## 🎯 Quick Extract Shortcuts

Use the sidebar to quickly extract common elements:
- **All Headings** - Extract all H1-H6 elements
- **All Links** - Extract all link URLs
- **All Images** - Extract all image sources
- **All Paragraphs** - Extract all paragraph text
- **All Tables** - Extract all table HTML

## 📝 CSS Selector Examples

| Selector | Description |
|----------|-------------|
| `.title` | Elements with class "title" |
| `#header` | Element with ID "header" |
| `h1, h2, h3` | All heading elements |
| `a[href^="https"]` | Links starting with "https" |
| `div > p` | Direct child paragraphs |
| `.product .price` | Price elements inside product |
| `[data-testid]` | Elements with data-testid attribute |

## 🏗️ Project Structure

```
ScrapeBI/
├── app.py                 # Main Flask application
├── run.py                 # Entry point script
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main UI template
└── static/
    └── js/
        └── app.js        # Frontend JavaScript
```

## 🔧 Advanced Usage

### Custom Wait Time

Increase the wait time for pages that load slowly or have heavy JavaScript:
- Default: 3 seconds
- Range: 1-10 seconds

### Batch Extraction

Create multiple rules and run them all at once:
1. Create rules for different data points
2. Click **"Run All Rules"**
3. All results will be displayed together

### Saved Rules

Rules are saved in memory during the session. To reuse rules:
1. Create and save rules
2. They appear in the sidebar
3. Run them anytime during your session

## 🛠️ Troubleshooting

### ChromeDriver Issues

If you see ChromeDriver errors:
1. Make sure Google Chrome is installed
2. The webdriver-manager will auto-download the correct ChromeDriver
3. If issues persist, manually install ChromeDriver matching your Chrome version

### Page Not Loading

If a page doesn't load properly:
1. Increase the wait time
2. Check if the website blocks automated browsers
3. Some sites may require additional headers or cookies

### Element Not Found

If an element isn't detected:
1. Try using the Visual Selector to find it
2. Use browser DevTools to inspect the element
3. Try different selector types (CSS, XPath, etc.)

## 🌐 Supported Websites

ScrapeBI works with most websites, including:
- Static HTML sites
- JavaScript-rendered sites (SPA)
- E-commerce sites
- News websites
- Blogs
- Documentation sites

**Note:** Some websites may have anti-scraping measures. Always respect robots.txt and terms of service.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the help modal in the app (click "Help" button)
3. Open an issue on GitHub

---

**Happy Scraping! 🕷️**
