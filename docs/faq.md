# Frequently Asked Questions

Common questions about ScrapeBI with detailed answers.

## Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Usage & Features](#usage--features)
- [Technical Questions](#technical-questions)
- [Troubleshooting](#troubleshooting)
- [Legal & Ethics](#legal--ethics)

---

## General Questions

### What is ScrapeBI?

ScrapeBI is a no-code web scraping tool that allows you to extract data from websites using a visual interface. Instead of writing code, you simply point and click on elements you want to extract.

### Is ScrapeBI free?

Yes! ScrapeBI is completely free and open-source under the MIT License. You can use it for personal or commercial projects without any cost.

### Who can use ScrapeBI?

Anyone! ScrapeBI is designed for:
- **Non-technical users** - No coding required
- **Data analysts** - Quick data extraction
- **Researchers** - Academic data collection
- **Marketers** - Lead generation, price monitoring
- **Developers** - Rapid prototyping, quick scrapes

### What websites can I scrape?

ScrapeBI works with most websites including:
- ✅ E-commerce sites
- ✅ News websites
- ✅ Blogs
- ✅ Documentation sites
- ✅ Public directories

**Note:** Always respect robots.txt and terms of service.

### Do I need programming knowledge?

No! ScrapeBI is designed for non-technical users. The visual selector lets you click elements to extract them without writing any code.

### What data formats can I export?

ScrapeBI supports three export formats:
- **JSON** - For developers and APIs
- **CSV** - For Excel and Google Sheets
- **TXT** - For simple text lists

---

## Installation & Setup

### What are the system requirements?

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | Windows 10, macOS 10.14, Linux | Latest version |
| Python | 3.8 | 3.10+ |
| RAM | 4 GB | 8 GB |
| Storage | 500 MB | 1 GB |
| Browser | Chrome 90+ | Chrome Latest |

### How do I install ScrapeBI?

**Quick Install:**
```bash
# 1. Clone or download
git clone https://github.com/RaoHamzaTariq/ScrapeBI.git
cd ScrapeBI

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run
python run.py
```

### Does it work on my operating system?

**Supported OS:**
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)

### Do I need to install Chrome?

Yes, Google Chrome is required because ScrapeBI uses Selenium with Chrome for web scraping.

**Download:** https://www.google.com/chrome/

### What if ChromeDriver installation fails?

ScrapeBI uses webdriver-manager which auto-installs ChromeDriver. If it fails:

1. **Update webdriver-manager:**
   ```bash
   pip install --upgrade webdriver-manager
   ```

2. **Manual install:**
   - Download from https://chromedriver.chromium.org/
   - Match Chrome version
   - Add to system PATH

### Can I run ScrapeBI without installing Python?

Currently, Python is required. However, we're working on:
- Standalone executable (no Python needed)
- Docker container
- Web-hosted version

---

## Usage & Features

### How do I scrape my first website?

1. Enter URL in the input field
2. Click "Scrape" button
3. Wait for page to load
4. Click elements you want to extract
5. Create extraction rule
6. Run rule and export results

**Detailed guide:** [First Scraper](first-scraper.md)

### What is the Visual Selector?

The Visual Selector shows a live preview of the scraped website. You can:
- Hover over elements to highlight them
- Click to select elements
- See element details instantly
- Create rules from selection

### How do I create extraction rules?

**Method 1 - Visual:**
1. Select element in Visual Selector
2. Click "Create Rule"
3. Name the rule
4. Save

**Method 2 - Manual:**
1. Click "Add Rule"
2. Enter selector details
3. Save rule

### Can I scrape multiple pages at once?

ScrapeBI currently scrapes one page at a time. For multiple pages:

1. Scrape each page separately
2. Or find a page that lists all items
3. Export and combine results

**Future:** Multi-page scraping support planned.

### How do I scrape JavaScript-heavy sites?

1. Increase wait time (5-10 seconds)
2. Use Visual Selector to verify content loaded
3. If content still missing, site may need interaction

### Can I schedule automatic scraping?

Not currently. ScrapeBI is manual-only. Workarounds:

1. Use OS scheduler (Task Scheduler/cron)
2. Run script at scheduled times
3. Use automation tools

**Future:** Built-in scheduling planned.

### How many rules can I save?

Rules are saved in memory during your session. There's no hard limit, but:
- 10-20 rules recommended per session
- Export results regularly
- Refresh for new scraping sessions

### Do saved rules persist after closing?

No, rules are stored in memory and lost when:
- Server stops
- Browser closes
- Page refreshes

**Tip:** Export rules or document them for reuse.

---

## Technical Questions

### What technology is ScrapeBI built with?

| Component | Technology |
|-----------|------------|
| Backend | Python, Flask |
| Automation | Selenium |
| Parsing | BeautifulSoup4 |
| Frontend | HTML, JavaScript, TailwindCSS |
| Data | Pandas |

### How does ScrapeBI handle dynamic content?

ScrapeBI uses Selenium which:
- Executes JavaScript like a real browser
- Waits for content to load
- Renders dynamic elements
- Handles AJAX requests

### Can I use ScrapeBI programmatically?

Yes! ScrapeBI has a REST API:

```python
import requests

# Scrape
response = requests.post('http://localhost:5000/api/scrape', 
  json={'url': 'https://example.com'})

# Extract
extract = requests.post('http://localhost:5000/api/extract',
  json={'session_id': session_id, 'rule': {...}})
```

See [API Reference](api-reference.md) for details.

### Does ScrapeBI support proxies?

Not in the current version. Future versions will include:
- Proxy configuration
- Proxy rotation
- Proxy testing

### Can I scrape sites that require login?

Not directly. Workarounds:

1. **Manual login first:**
   - Open site in Chrome
   - Login manually
   - Then scrape in ScrapeBI

2. **Cookie export:**
   - Export cookies from browser
   - Import to ScrapeBI (advanced)

**Future:** Built-in authentication support.

### What's the maximum page size ScrapeBI can handle?

ScrapeBI can handle most websites. Limitations:
- Very large pages (>10MB) may be slow
- Complex JavaScript may timeout
- Infinite scroll needs special handling

### Does ScrapeBI store scraped data?

Temporarily, yes:
- Data stored in memory during session
- Not saved to disk automatically
- Lost when server restarts

**Always export important data!**

---

## Troubleshooting

### Why is the preview showing an error?

Some websites don't display in the iframe preview due to:
- Security restrictions (CSP)
- X-Frame-Options header
- Cross-origin policies

**Solution:** Use Element List tab instead.

### Why are some elements not detected?

Possible causes:
- Elements inside iframes
- Content loaded after scrape completes
- Elements hidden by CSS

**Solutions:**
- Increase wait time
- Use Element List
- Check HTML tab

### Why is scraping slow?

Common causes:
- Slow internet connection
- Large/complex website
- Low system resources
- High wait time setting

**Solutions:**
- Reduce wait time if possible
- Close other applications
- Check internet speed

### Why do I get "Session not found" errors?

Sessions expire when:
- Server restarts
- Too much time passes
- Memory cleared

**Solution:** Re-scrape the URL to create new session.

### Why are my exports empty?

Causes:
- No extraction rules run
- Rules returned no results
- Export before running rules

**Solution:** Run rules first, then export.

### Chrome crashes when scraping

Causes:
- Page too large
- Memory issues
- Chrome bug

**Solutions:**
- Restart Chrome
- Reduce page complexity
- Update Chrome
- Increase system RAM

---

## Legal & Ethics

### Is web scraping legal?

Generally yes, for public data. Considerations:

**Usually OK:**
- ✅ Public data
- ✅ Personal use
- ✅ Research purposes

**Check first:**
- ⚠️ Commercial use
- ⚠️ Copyrighted content
- ⚠️ Personal data

**Always:**
- Respect robots.txt
- Follow terms of service
- Don't overload servers

### Do I need permission to scrape?

For public websites, usually no. But:
- Check robots.txt
- Review terms of service
- Don't scrape personal data
- Don't overload servers

### Can I get blocked for scraping?

Yes, websites can block scrapers:
- IP blocking
- CAPTCHA challenges
- Rate limiting

**Reduce risk:**
- Use reasonable delays
- Don't scrape too frequently
- Respect robots.txt
- Use official APIs when available

### What about GDPR?

GDPR applies to personal data of EU citizens:

**Don't scrape:**
- ❌ Personal information
- ❌ Email addresses
- ❌ Phone numbers
- ❌ Private data

**Without explicit permission.**

### Can I use scraped data commercially?

Depends on:
- Data type
- Source website terms
- Local laws
- Intended use

**Recommendations:**
- Review terms of service
- Consult legal counsel
- Consider licensing
- Use official APIs when possible

### Is ScrapeBI responsible for how I use it?

No. ScrapeBI is a tool. You are responsible for:
- What you scrape
- How you use data
- Compliance with laws
- Respecting website terms

---

## Still Have Questions?

### Documentation
- Browse [Documentation Index](README.md)
- Check specific guides

### Support Channels
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Email: Contact via GitHub profile

### Community
- Check existing issues
- Search discussions
- Ask in community forums

---

**Last Updated:** February 25, 2026
