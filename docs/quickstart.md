# Quick Start Guide

Get up and running with ScrapeBI in 5 minutes! This guide will help you create your first web scraper without writing any code.

## Table of Contents

- [5-Minute Quickstart](#5-minute-quickstart)
- [Step 1: Launch ScrapeBI](#step-1-launch-scrapebi)
- [Step 2: Scrape Your First Website](#step-2-scrape-your-first-website)
- [Step 3: Select Elements](#step-3-select-elements)
- [Step 4: Create Extraction Rule](#step-4-create-extraction-rule)
- [Step 5: Export Data](#step-5-export-data)
- [What's Next?](#whats-next)

## 5-Minute Quickstart

Let's scrape product information from an e-commerce website as an example.

### What We'll Extract:
- Product titles
- Product prices
- Product images

## Step 1: Launch ScrapeBI

**Windows:**
```bash
python run.py
```
Or double-click `start.bat`

**macOS/Linux:**
```bash
python3 run.py
```

Your browser will automatically open to `http://localhost:5000`

## Step 2: Scrape Your First Website

1. **Enter URL**
   - In the URL input field, enter: `https://books.toscrape.com/`
   - This is a practice scraping website

2. **Set Wait Time**
   - Keep the default wait time at 3 seconds
   - Increase for slower websites

3. **Click "Scrape"**
   - Click the blue "Scrape" button
   - Wait for the page to load in the preview

## Step 3: Select Elements

### Using Visual Selector

1. **Switch to Visual Selector Tab**
   - Click the "Visual Selector" tab

2. **Browse the Preview**
   - You'll see the scraped website in an iframe
   - Hover over elements to highlight them

3. **Click to Select**
   - Click on a product title
   - The element details will appear below

### Using Element List

1. **Switch to Element List Tab**
   - Click the "Element List" tab

2. **Browse Categories**
   - Headings - All heading elements (H1-H6)
   - Links - All clickable links
   - Images - All images on the page
   - Paragraphs - All text paragraphs

3. **Select an Element**
   - Click any element in the list
   - View its CSS selector

## Step 4: Create Extraction Rule

### Create Your First Rule

1. **Click "Add Rule"**
   - In the Extraction Rules tab
   - Or click "Create Rule" after selecting an element

2. **Fill in Rule Details**
   ```
   Rule Name: Product Titles
   Selector Type: CSS Selector
   Selector: .product_pod h3 a
   Extract: Text Content
   ```

3. **Save Rule**
   - Click "Save Rule"
   - Your rule appears in the sidebar

### Create More Rules

Repeat for prices:
```
Rule Name: Product Prices
Selector Type: CSS Selector
Selector: .product_price .price_color
Extract: Text Content
```

And for images:
```
Rule Name: Product Images
Selector Type: CSS Selector
Selector: .product_pod img
Extract: Src (for images)
```

## Step 5: Export Data

### Run Extraction

1. **Click "Run All Rules"**
   - All three rules will execute
   - Results appear in the Results tab

2. **Review Results**
   - See extracted data organized by rule
   - Verify the data looks correct

### Export Options

1. **Export as JSON**
   - Click "JSON" button
   - Downloads structured data file

2. **Export as CSV**
   - Click "CSV" button
   - Opens in Excel/Google Sheets

3. **Export as TXT**
   - Click "TXT" button
   - Plain text format

## Understanding the Interface

### Main Sections

```
┌─────────────────────────────────────────────────────┐
│  Header (Logo, Help, GitHub, Status)                │
├─────────────────────────────────────────────────────┤
│  Step Indicator (1→2→3→4)                           │
├─────────────────────────────────────────────────────┤
│  URL Input + Wait Time + Scrape Button              │
├─────────────────────────────────────────────────────┤
│  Tabs: Visual | Elements | HTML | Rules | Results   │
├──────────────────────────┬──────────────────────────┤
│  Main Content Area       │  Sidebar                 │
│  - Preview               │  - Session Status        │
│  - Element List          │  - Quick Extract         │
│  - Rules                 │  - Saved Rules           │
│  - Results               │  - Run All Rules         │
└──────────────────────────┴──────────────────────────┘
```

### Step Indicator

Shows your progress through the scraping workflow:
1. **Enter URL** - Input the website to scrape
2. **Select Elements** - Choose what to extract
3. **Extract Data** - Create and run rules
4. **Export Results** - Download your data

## Quick Extract Features

Use the sidebar for instant extraction:

- **All Headings** - Extracts H1-H6 elements
- **All Links** - Extracts all URLs
- **All Images** - Extracts image sources
- **All Paragraphs** - Extracts text content
- **All Tables** - Extracts table data

## Tips for Beginners

### ✅ Do's
- Start with simple websites (like example.com)
- Use the Visual Selector to learn CSS selectors
- Save your rules for reuse
- Export as CSV for easy analysis

### ❌ Don'ts
- Don't scrape too quickly (respect websites)
- Don't ignore robots.txt
- Don't overload servers with rapid requests
- Don't scrape copyrighted content without permission

## Common First Scrapers

Try these beginner-friendly websites:

1. **Books to Scrape** - `https://books.toscrape.com/`
   - Practice with book data

2. **Quotes to Scrape** - `http://quotes.toscrape.com/`
   - Practice with quotes and authors

3. **Example.com** - `https://example.com/`
   - Simple test page

4. **Wikipedia** - `https://wikipedia.org/`
   - Practice with structured content

## What's Next?

Now that you've created your first scraper:

- Read [Basic Usage Guide](basic-usage.md) for detailed features
- Learn [CSS Selectors](advanced-selectors.md) for precise targeting
- Explore [Export Options](export-data.md) for data analysis
- Check [Best Practices](best-practices.md) for effective scraping

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Scrape website |
| `Ctrl + S` | Save rule (in modal) |
| `Escape` | Close modal |

## Need Help?

- Click the **Help** button in the app
- Check [Troubleshooting](troubleshooting.md)
- Read the [FAQ](faq.md)

---

**Congratulations! 🎉** You've created your first web scraper with ScrapeBI!
