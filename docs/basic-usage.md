# Basic Usage Guide

Master the core features of ScrapeBI with this comprehensive guide.

## Table of Contents

- [Interface Overview](#interface-overview)
- [URL Input Section](#url-input-section)
- [Visual Selector](#visual-selector)
- [Element List](#element-list)
- [HTML Code View](#html-code-view)
- [Extraction Rules](#extraction-rules)
- [Results & Export](#results--export)
- [Sidebar Features](#sidebar-features)
- [Keyboard Shortcuts](#keyboard-shortcuts)

## Interface Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Logo | Help | GitHub | Status                          │
├─────────────────────────────────────────────────────────────────┤
│  Step Indicator: 1→2→3→4                                        │
├─────────────────────────────────────────────────────────────────┤
│  URL Input | Wait Time | [Scrape Button]                        │
├─────────────────────────────────────────────────────────────────┤
│  Tabs: Visual | Elements | HTML | Rules | Results               │
├──────────────────────────┬──────────────────────────────────────┤
│  Main Content Area       │  Sidebar                             │
│  • Page Preview          │  • Session Status                    │
│  • Element List          │  • Quick Extract                     │
│  • HTML Code             │  • Saved Rules                       │
│  • Rules Manager         │  • [Run All Rules]                   │
│  • Results Table         │  • Pro Tips                          │
└──────────────────────────┴──────────────────────────────────────┘
```

## URL Input Section

### Entering a URL

1. **Basic URL**
   ```
   https://example.com
   ```

2. **URL without protocol** (auto-adds https://)
   ```
   example.com
   ```

3. **Full URL with path**
   ```
   https://example.com/products/page1
   ```

### Wait Time Settings

| Wait Time | Use Case |
|-----------|----------|
| 1-2 seconds | Simple, fast-loading sites |
| 3-5 seconds | Standard websites (default) |
| 6-10 seconds | JavaScript-heavy sites |

### Scrape Button States

| State | Appearance | Meaning |
|-------|------------|---------|
| Ready | Blue, enabled | Ready to scrape |
| Loading | Gray, disabled | Currently scraping |
| Complete | Green check | Scraping successful |

## Visual Selector

### How It Works

1. **Hover to Highlight**
   - Move cursor over elements in preview
   - Elements highlight with blue outline

2. **Click to Select**
   - Click any element
   - Element highlights with green outline
   - Element details appear below

3. **Create Rule from Selection**
   - Click "Create Rule" button
   - Selector auto-fills
   - Name your rule and save

### Selection Details Panel

When you select an element, you'll see:
```
✓ Element Selected
─────────────────────────────────
Tag: H3
Class: product-title
ID: product-123
Text: "Amazing Product"
Selector: .product-card h3
─────────────────────────────────
[Create Rule] [Clear]
```

### Tips for Visual Selection

✅ **Do:**
- Click directly on the text or element you want
- Use zoom to select small elements
- Test selection before creating rule

❌ **Don't:**
- Click on dynamic elements (menus, popups)
- Select elements inside iframes (may not work)
- Rush - take time to select accurately

## Element List

### Element Categories

| Category | Icon | Description |
|----------|------|-------------|
| Headings | 📝 | H1, H2, H3, H4, H5, H6 |
| Links | 🔗 | All `<a>` tags with href |
| Images | 🖼️ | All `<img>` tags |
| Paragraphs | ¶ | All `<p>` tags |
| Tables | 📊 | All `<table>` elements |
| Lists | 📋 | `<ul>` and `<ol>` lists |
| Forms | ✉️ | All `<form>` elements |
| Buttons | 🔘 | `<button>` and submit inputs |
| Inputs | ⌨️ | All `<input>` fields |

### Using Element List

1. **Expand Category**
   - Click category header
   - See all elements of that type

2. **View Element Details**
   - Each element shows:
     - Preview text/content
     - CSS selector
     - Additional attributes

3. **Select Element**
   - Click any element
   - Use for rule creation

### Element Card Information

```
┌─────────────────────────────────────────┐
│ [H3] Product Title                      │
│      .product-card h3                   │
└─────────────────────────────────────────┘
```

## HTML Code View

### Features

- **Syntax Highlighted** - Color-coded HTML tags
- **Line Numbers** - Easy reference
- **Search** - Find specific elements
- **Copy** - Copy entire HTML or sections
- **Download** - Save HTML file locally

### Using HTML View

1. **View Source**
   - Switch to "HTML Code" tab
   - See full page source

2. **Find Selectors**
   - Search for class names or IDs
   - Use for creating custom rules

3. **Copy HTML**
   - Click "Copy HTML" button
   - Paste in text editor

4. **Download HTML**
   - Click "Download" button
   - Save .html file

### HTML Statistics

Shows:
- Total lines of code
- File size in KB
- Number of elements

## Extraction Rules

### Creating Rules

#### Method 1: From Visual Selection
1. Select element in Visual Selector
2. Click "Create Rule"
3. Name the rule
4. Click "Save Rule"

#### Method 2: Manual Entry
1. Click "Add Rule" button
2. Fill in all fields
3. Click "Save Rule"

### Rule Components

| Field | Description | Example |
|-------|-------------|---------|
| Rule Name | Descriptive name | "Product Prices" |
| Selector Type | How to find elements | CSS Selector |
| Selector | Pattern to match | `.price` |
| Extract Attribute | What data to get | Text Content |

### Selector Types

| Type | When to Use | Example |
|------|-------------|---------|
| CSS Selector | Most cases | `.product-title` |
| XPath | Complex structures | `//div[@class='price']` |
| Tag Name | All elements of type | `h1` |
| Class Name | By class only | `product-title` |
| ID | Unique elements | `main-content` |

### Extract Attributes

| Attribute | Returns | Best For |
|-----------|---------|----------|
| Text Content | Visible text | Articles, titles |
| HTML Content | Full HTML | Structured content |
| Href | URL | Links |
| Src | Image URL | Images |
| Alt | Alt text | Image descriptions |
| Title | Title attribute | Tooltips |

## Results & Export

### Viewing Results

After running rules:

```
┌─────────────────────────────────────────┐
│ ✓ Extraction Complete                   │
│ 4 rules executed • 40 items extracted   │
├─────────────────────────────────────────┤
│ 📖 Book Titles (10 items)               │
│ ├─ #1: A Light in the Attic            │
│ ├─ #2: Tipping the Velvet              │
│ └─ ...                                  │
├─────────────────────────────────────────┤
│ 💰 Book Prices (10 items)               │
│ ├─ #1: £51.77                          │
│ ├─ #2: £53.74                          │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

### Export Formats

#### JSON
- **Best for:** Developers, APIs, structured data
- **Structure:** Organized by rule name
- **File:** `.json`

#### CSV
- **Best for:** Excel, Google Sheets, analysis
- **Structure:** Flat table format
- **File:** `.csv`

#### TXT
- **Best for:** Simple lists, quick reference
- **Structure:** Plain text with headers
- **File:** `.txt`

### Export Process

1. Go to Results tab
2. Click desired format button
3. File downloads automatically
4. Open with appropriate application

## Sidebar Features

### Session Status

Shows current session information:
- ✅ Active Session (green)
- ⏸️ No Active Session (gray)
- Page URL
- Page Title

### Quick Extract

One-click extraction for common elements:

| Button | Extracts | Selector Used |
|--------|----------|---------------|
| All Headings | H1-H6 | `h1, h2, h3, h4, h5, h6` |
| All Links | URLs | `a[href]` |
| All Images | Image sources | `img` |
| All Paragraphs | Text | `p` |
| All Tables | Table HTML | `table` |

### Saved Rules

- Lists all saved extraction rules
- Click rule name to view details
- Rules persist during session
- Delete rules with × button

### Run All Rules

**Big blue button** at bottom of sidebar:
- Executes all saved rules
- Shows progress
- Displays results in Results tab

### Pro Tips

Yellow info box with helpful hints:
- CSS selector examples
- Best practices
- Time-saving tips

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl + Enter` | Scrape website | Anywhere |
| `Ctrl + S` | Save rule | In Add Rule modal |
| `Escape` | Close modal | When modal is open |
| `Tab` | Navigate form | In forms |
| `Enter` | Submit form | In forms |

## Tips for Success

### ✅ Best Practices

1. **Start Simple**
   - Begin with easy websites
   - Practice on books.toscrape.com

2. **Test Selectors**
   - Use Visual Selector first
   - Verify selector works before saving

3. **Name Rules Clearly**
   - Use descriptive names
   - Include what and where (e.g., "Product Prices - Amazon")

4. **Export Regularly**
   - Save results frequently
   - Keep backups of important data

### ❌ Common Mistakes to Avoid

1. **Too Complex Selectors**
   - Start simple, add specificity as needed

2. **Not Testing**
   - Always test rules before batch running

3. **Ignoring Wait Time**
   - Increase for slow sites
   - Decrease for fast sites

4. **Forgetting to Export**
   - Results are session-based
   - Export before closing

---

**Next:** Learn about the [Visual Selector](visual-selector.md) in detail.
