# Your First Scraper

Create your first web scraper in under 10 minutes with this step-by-step tutorial.

## Table of Contents

- [What We'll Build](#what-well-build)
- [Prerequisites](#prerequisites)
- [Step 1: Launch ScrapeBI](#step-1-launch-scrapebi)
- [Step 2: Scrape a Practice Website](#step-2-scrape-a-practice-website)
- [Step 3: Select Elements](#step-3-select-elements)
- [Step 4: Create Extraction Rules](#step-4-create-extraction-rules)
- [Step 5: Run and Export](#step-5-run-and-export)
- [Next Steps](#next-steps)

## What We'll Build

We'll create a scraper that extracts book information from [Books to Scrape](http://books.toscrape.com/), a practice website designed for learning web scraping.

### Data We'll Extract:
- 📖 Book titles
- 💰 Book prices
- ⭐ Star ratings
- 📷 Book cover images

## Prerequisites

- ✅ ScrapeBI installed (see [Installation Guide](installation.md))
- ✅ Google Chrome installed
- ✅ Internet connection

## Step 1: Launch ScrapeBI

### Windows
```bash
python run.py
```
Or double-click `start.bat`

### macOS/Linux
```bash
python3 run.py
```
Or run `./start.sh`

Your browser will automatically open to `http://localhost:5000`

## Step 2: Scrape a Practice Website

### 2.1 Enter URL

In the URL input field, enter:
```
http://books.toscrape.com/
```

### 2.2 Set Wait Time

Keep the default wait time at **3 seconds** (sufficient for this website).

### 2.3 Click Scrape

Click the blue **"Scrape"** button and wait for the page to load.

**Expected Result:**
- ✅ Step indicator moves to Step 2
- ✅ Page preview appears in Visual Selector tab
- ✅ Session status shows "Active Session"

## Step 3: Select Elements

### Option A: Visual Selector (Recommended for Beginners)

1. **Switch to Visual Selector Tab**
   - Click the "Visual Selector" tab

2. **Browse the Preview**
   - You'll see the Books to Scrape homepage
   - Books are displayed in a grid layout

3. **Select a Book Title**
   - Hover over any book title - it highlights in blue
   - Click the title - it highlights in green
   - Element details appear below the preview

### Option B: Element List

1. **Switch to Element List Tab**
   - Click the "Element List" tab

2. **Expand Categories**
   - Click on "Headings" to see all headings
   - Click on "Links" to see all links
   - Click on "Images" to see all images

3. **Select an Element**
   - Click any element to view its selector

## Step 4: Create Extraction Rules

### Rule 1: Book Titles

1. **Click "Add Rule"** button

2. **Fill in Rule Details:**
   ```
   Rule Name: Book Titles
   Selector Type: CSS Selector
   Selector: .product_pod h3 a
   Extract: Text Content
   ```

3. **Click "Save Rule"**

### Rule 2: Book Prices

1. **Click "Add Rule"** again

2. **Fill in Rule Details:**
   ```
   Rule Name: Book Prices
   Selector Type: CSS Selector
   Selector: .product_price .price_color
   Extract: Text Content
   ```

3. **Click "Save Rule"**

### Rule 3: Star Ratings

1. **Click "Add Rule"**

2. **Fill in Rule Details:**
   ```
   Rule Name: Star Ratings
   Selector Type: CSS Selector
   Selector: .product_pod .star-rating
   Extract: Title Attribute
   ```

3. **Click "Save Rule"**

### Rule 4: Book Images

1. **Click "Add Rule"**

2. **Fill in Rule Details:**
   ```
   Rule Name: Book Images
   Selector Type: CSS Selector
   Selector: .product_pod img
   Extract: Src (for images)
   ```

3. **Click "Save Rule"**

## Step 5: Run and Export

### 5.1 Run All Rules

1. **Click "Run All Rules"** button in the sidebar

2. **Wait for Processing**
   - All 4 rules execute
   - Results appear in the Results tab

3. **Review Results**
   - Switch to "Results" tab
   - See extracted data organized by rule

### 5.2 Export Data

#### Export as JSON
```
Click "JSON" button → Downloads scraped_data.json
```

**Sample Output:**
```json
{
  "Book Titles": [
    "A Light in the Attic",
    "Tipping the Velvet",
    "Soumission"
  ],
  "Book Prices": [
    "£51.77",
    "£53.74",
    "£50.10"
  ],
  "Star Ratings": [
    "Three",
    "Two",
    "One"
  ],
  "Book Images": [
    "media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg",
    "media/cache/26/0c/260c6ae16bce31c8f8c95daddd9f4a1c.jpg"
  ]
}
```

#### Export as CSV
```
Click "CSV" button → Downloads scraped_data.csv
```

**Opens in Excel/Google Sheets:**
| rule | index | value |
|------|-------|-------|
| Book Titles | 1 | A Light in the Attic |
| Book Titles | 2 | Tipping the Velvet |
| Book Prices | 1 | £51.77 |
| Book Prices | 2 | £53.74 |

#### Export as TXT
```
Click "TXT" button → Downloads scraped_data.txt
```

**Plain Text Output:**
```
=== Book Titles ===
--------------------------------------------------
1. A Light in the Attic
2. Tipping the Velvet
3. Soumission

=== Book Prices ===
--------------------------------------------------
1. £51.77
2. £53.74
```

## Summary

Congratulations! You've created your first web scraper! 🎉

### What You Learned:
1. ✅ How to launch ScrapeBI
2. ✅ How to scrape a website
3. ✅ How to select elements visually
4. ✅ How to create extraction rules
5. ✅ How to export data in multiple formats

## Next Steps

### Practice More
- Try scraping other pages on books.toscrape.com
- Experiment with different selectors
- Create more complex extraction rules

### Learn More
- Read [Basic Usage Guide](basic-usage.md) for all features
- Learn [Advanced Selectors](advanced-selectors.md) for precise targeting
- Explore [Export Options](export-data.md) for data analysis

### Challenge Yourself
Try scraping these practice sites:
- [Quotes to Scrape](http://quotes.toscrape.com/) - Extract quotes and authors
- [Web Scraper Sandbox](https://webscraper.io/test-sites) - Various test sites

---

**Need Help?** Check [Troubleshooting](troubleshooting.md) or the [FAQ](faq.md).
