<p align="center">
  <img src="public/logo.png" alt="ScrapeBI Logo" width="180">
</p>

<h1 align="center">🕷️ ScrapeBI</h1>

<p align="center">
  <strong>No-Code Web Scraping Tool with Visual Element Selector</strong>
</p>

<p align="center">
  Extract data from any website without writing a single line of code.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ScrapeBI-v1.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-2.3.3-orange?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Selenium-4.15.2-red?style=for-the-badge&logo=selenium&logoColor=white" alt="Selenium">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/RaoHamzaTariq/ScrapeBI?style=flat-square" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/RaoHamzaTariq/ScrapeBI?style=flat-square" alt="GitHub forks">
  <img src="https://img.shields.io/github/issues/RaoHamzaTariq/ScrapeBI?style=flat-square" alt="GitHub issues">
  <img src="https://img.shields.io/github/last-commit/RaoHamzaTariq/ScrapeBI?style=flat-square" alt="Last commit">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

![ScrapeBI Preview](public/preview.png)

---

## 📖 About ScrapeBI

ScrapeBI is a powerful, user-friendly web scraping tool that enables anyone to extract data from websites without programming knowledge. Built with modern technologies and designed for both beginners and professionals, ScrapeBI transforms complex web scraping into a simple point-and-click experience.

### Why Choose ScrapeBI?

| Feature | Benefit |
|---------|---------|
| 🎯 **No-Code Interface** | No programming skills required - anyone can use it |
| 👁️ **Visual Selector** | See and click elements to extract in real-time |
| ⚡ **Fast Extraction** | Powered by Selenium for dynamic content |
| 📊 **Multiple Exports** | JSON, CSV, TXT formats supported |
| 🔄 **Batch Processing** | Run multiple extraction rules simultaneously |
| 💾 **Save Rules** | Reuse extraction rules across sessions |

---

## ✨ Features

### Core Features

- 🔍 **Visual Element Selector** - Click on elements in a live preview to select them
- 📋 **Smart Element Detection** - Automatically detects and categorizes all page elements
- 🎯 **No-Code Extraction** - Create extraction rules with CSS selectors, XPath, or element properties
- 📊 **Multiple Export Formats** - Export data as JSON, CSV, or TXT
- 🖥️ **Modern UI** - Clean, responsive interface with real-time previews
- ⚡ **Quick Extract** - One-click extraction of common elements

### Advanced Features

- 💾 **Save Rules** - Save and reuse extraction rules across different pages
- 🔄 **Batch Processing** - Run multiple extraction rules at once
- 🎨 **Element Categorization** - Browse elements by type (headings, links, images, etc.)
- 🔧 **Custom Selectors** - Support for CSS, XPath, Tag, Class, and ID selectors
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

---

## 🚀 Quick Start

### Installation

#### Option 1: Using the Runner (Recommended)

```bash
# Clone the repository
git clone https://github.com/RaoHamzaTariq/ScrapeBI.git
cd ScrapeBI

# Install dependencies
pip install -r requirements.txt

# Run ScrapeBI
python run.py
```

#### Option 2: One-Click Start

| Platform | Method |
|----------|--------|
| Windows | Double-click `start.bat` |
| macOS/Linux | Run `./start.sh` |

#### Option 3: Using Python Directly

```bash
# Run the Flask app directly
python app.py
```

### First Steps

1. **Enter URL** - Input the website you want to scrape
2. **Set Wait Time** - Adjust load time for slower websites (default: 3s)
3. **Click Scrape** - Fetch the website content
4. **Select Elements** - Use Visual Selector or Element List
5. **Create Rules** - Define what data to extract
6. **Export Data** - Download as JSON, CSV, or TXT

> 💡 **Tip:** The application will automatically open your browser at `http://localhost:5000`

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

### Getting Started

| Document | Description |
|----------|-------------|
| [📖 Installation Guide](docs/installation.md) | Step-by-step setup for all platforms |
| [🚀 Quick Start](docs/quickstart.md) | Get up and running in 5 minutes |
| [🎯 First Scraper](docs/first-scraper.md) | Create your first web scraper |

### User Guides

| Document | Description |
|----------|-------------|
| [📝 Basic Usage](docs/basic-usage.md) | Core features and functionality |
| [👁️ Visual Selector](docs/visual-selector.md) | Using the visual element selector |
| [🎯 Extraction Rules](docs/extraction-rules.md) | Creating and managing rules |
| [📤 Export Data](docs/export-data.md) | Exporting scraped data |

### Advanced Topics

| Document | Description |
|----------|-------------|
| [🔧 Advanced Selectors](docs/advanced-selectors.md) | CSS and XPath techniques |
| [⚡ Dynamic Websites](docs/dynamic-websites.md) | Scraping JavaScript-heavy sites |
| [📊 Batch Processing](docs/batch-processing.md) | Running multiple extractions |
| [✅ Best Practices](docs/best-practices.md) | Tips for effective scraping |

### Reference

| Document | Description |
|----------|-------------|
| [📋 API Reference](docs/api-reference.md) | Backend API documentation |
| [⚙️ Configuration](docs/configuration.md) | Configuration options |
| [🔧 Troubleshooting](docs/troubleshooting.md) | Common issues and solutions |
| [❓ FAQ](docs/faq.md) | Frequently asked questions |

---

## 🎯 Usage Examples

### CSS Selector Examples

| Selector | Description | Example Use |
|----------|-------------|-------------|
| `.product-title` | Elements with class "product-title" | E-commerce product names |
| `#main-content` | Element with ID "main-content" | Main article content |
| `h1, h2, h3` | All heading elements | Page structure |
| `a[href^="https"]` | Links starting with "https" | External links |
| `.price` | Price elements | Product prices |
| `img.product-image` | Product images | Image URLs |

### Quick Extract Shortcuts

Use the sidebar for instant extraction:

```
• All Headings    → Extract H1-H6 elements
• All Links       → Extract all URLs
• All Images      → Extract image sources
• All Paragraphs  → Extract text content
• All Tables      → Extract table data
```

---

## 🏗️ Project Structure

```
ScrapeBI/
├── app.py                 # Main Flask application
├── run.py                 # Entry point script
├── requirements.txt       # Python dependencies
├── start.bat              # Windows launcher
├── start.sh               # macOS/Linux launcher
├── README.md              # Project documentation
├── .gitignore             # Git ignore rules
│
├── docs/                  # Documentation folder
│   ├── README.md          # Documentation index
│   ├── installation.md    # Installation guide
│   ├── quickstart.md      # Quick start guide
│   ├── advanced-selectors.md
│   └── troubleshooting.md
│
├── templates/
│   └── index.html         # Main UI template
│
├── static/
│   ├── css/
│   │   └── style.css      # Custom styles
│   ├── js/
│   │   └── app.js         # Frontend JavaScript
│   └── logo.png           # Application logo
│
└── public/
    ├── logo.png           # Public logo
    └── preview.png        # Preview screenshot
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Python 3.8+ | Core programming language |
| **Framework** | Flask 2.3.3 | Web application framework |
| **Automation** | Selenium 4.15.2 | Browser automation |
| **Parsing** | BeautifulSoup4 | HTML/XML parsing |
| **Data** | Pandas 2.2.0 | Data manipulation |
| **Frontend** | TailwindCSS | UI styling |
| **Icons** | Font Awesome | Icon library |
| **Fonts** | Outfit, JetBrains Mono | Typography |

---

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `development` | Flask environment mode |
| `FLASK_PORT` | `5000` | Server port |
| `WAIT_TIME` | `3` | Default page load wait time |

### Customization

Edit `app.py` to customize:

```python
# Change default port
app.run(debug=True, host='0.0.0.0', port=5001)

# Modify wait time range
# In templates/index.html, adjust min/max attributes
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Open an issue with detailed information
- 💡 **Suggest Features** - Share your ideas for new features
- 📝 **Improve Docs** - Fix typos or add missing documentation
- 🔧 **Submit PRs** - Fix bugs or add new features

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed guidelines, see [Contributing Guide](docs/contributing.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ScrapeBI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Selenium](https://www.selenium.dev/) - Browser automation
- [TailwindCSS](https://tailwindcss.com/) - UI framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) - HTML parsing

---

## 📧 Support

Need help? Here's how to reach us:

| Resource | Link |
|----------|------|
| 📖 Documentation | [docs/](docs/) |
| 🐛 Report Issue | [GitHub Issues](https://github.com/RaoHamzaTariq/ScrapeBI/issues) |
| 💬 Discussions | [GitHub Discussions](https://github.com/RaoHamzaTariq/ScrapeBI/discussions) |
| 📧 Email | [Contact via GitHub](https://github.com/RaoHamzaTariq) |

---

<p align="center">
  <strong>Happy Scraping! 🕷️</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/RaoHamzaTariq">Rao Hamza Tariq</a>
</p>
