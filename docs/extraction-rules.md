# Extraction Rules Guide

Create powerful, reusable extraction rules to automate your web scraping.

## Table of Contents

- [What are Extraction Rules?](#what-are-extraction-rules)
- [Rule Components](#rule-components)
- [Creating Rules](#creating-rules)
- [Selector Types](#selector-types)
- [Extract Attributes](#extract-attributes)
- [Managing Rules](#managing-rules)
- [Running Rules](#running-rules)
- [Advanced Techniques](#advanced-techniques)

## What are Extraction Rules?

Extraction rules are saved configurations that tell ScrapeBI exactly what data to extract from a webpage. Think of them as reusable scraping instructions.

### Benefits of Rules

| Without Rules | With Rules |
|---------------|------------|
| Select elements every time | One-click extraction |
| Manual process | Automated |
| Error-prone | Consistent results |
| Time-consuming | Instant results |
| Not reusable | Save and reuse |

### Rule Structure

```
┌─────────────────────────────────────────┐
│ Rule: Product Prices                    │
├─────────────────────────────────────────┤
│ Selector Type: CSS Selector             │
│ Selector: .product_price .price_color   │
│ Extract: Text Content                   │
├─────────────────────────────────────────┤
│ Status: ✓ Active | Created: 2026-02-25 │
└─────────────────────────────────────────┘
```

## Rule Components

### 1. Rule Name

**Purpose:** Identify and organize rules

**Best Practices:**
- Be descriptive: "Product Prices" not "Prices"
- Include context: "Amazon - Product Prices"
- Use consistent naming: "Site - Data Type"

**Examples:**
```
✅ Good:
- "Book Titles - BooksToScrape"
- "Product Prices - Amazon"
- "Article Headlines - News"

❌ Bad:
- "Titles"
- "Stuff"
- "Rule 1"
```

### 2. Selector Type

**Purpose:** Define how to find elements

**Available Types:**
- CSS Selector (recommended)
- XPath (advanced)
- Tag Name
- Class Name
- ID

### 3. Selector

**Purpose:** Pattern to match elements

**Examples by Type:**

| Type | Example | Matches |
|------|---------|---------|
| CSS | `.product-title` | Elements with class |
| CSS | `#main-content` | Element with ID |
| CSS | `h1, h2, h3` | All headings |
| XPath | `//div[@class='price']` | Div with class |
| Tag | `p` | All paragraphs |
| Class | `product-title` | By class name |
| ID | `header` | By ID |

### 4. Extract Attribute

**Purpose:** What data to retrieve

**Options:**
- Text Content
- HTML Content
- Href (links)
- Src (images)
- Alt text
- Title attribute
- ID attribute
- Class attribute
- All Data

## Creating Rules

### Method 1: From Visual Selection

**Steps:**

1. **Select Element Visually**
   - Go to Visual Selector tab
   - Click desired element
   - Element highlights green

2. **Click "Create Rule"**
   - Button appears in element details
   - Rule modal opens

3. **Fill Rule Details**
   ```
   Rule Name: Product Titles
   Selector Type: CSS Selector (pre-filled)
   Selector: .product-card h3 (pre-filled)
   Extract: Text Content
   ```

4. **Save Rule**
   - Click "Save Rule"
   - Rule appears in sidebar

### Method 2: Manual Creation

**Steps:**

1. **Click "Add Rule" Button**
   - In Extraction Rules tab
   - Or sidebar

2. **Fill All Fields**
   ```
   Rule Name: [Enter descriptive name]
   Selector Type: [Choose from dropdown]
   Selector: [Enter pattern]
   Extract: [Choose attribute]
   ```

3. **Save Rule**
   - Click "Save Rule"
   - Rule saved to session

### Method 3: From Element List

**Steps:**

1. **Browse Element List**
   - Go to Element List tab
   - Expand category

2. **Select Element**
   - Click element card
   - View details

3. **Create Rule**
   - Use displayed selector
   - Follow manual creation steps

## Selector Types

### CSS Selector (Recommended)

**When to Use:** Most scraping tasks

**Syntax Examples:**

```css
/* By Class */
.product-title
.btn-primary
.price

/* By ID */
#main-content
#header-nav

/* By Tag */
h1
p
a

/* By Attribute */
a[href^="https"]
img[src$=".jpg"]
[data-product-id]

/* By Relationship */
.product-card h3
div > p
h1 + p
```

**Pros:**
- ✅ Fast performance
- ✅ Easy to learn
- ✅ Widely supported
- ✅ Readable syntax

**Cons:**
- ❌ Limited for complex structures

### XPath

**When to Use:** Complex nested structures

**Syntax Examples:**

```xpath
<!-- By Class -->
//*[@class="product-title"]

<!-- By Tag -->
//h1

<!-- By Attribute -->
//a[@href="https://example.com"]

<!-- By Text -->
//p[contains(text(), "price")]

<!-- By Position -->
//div[1]
//ul/li[2]

<!-- By Relationship -->
//div[@class="product"]/h3
//h1/following-sibling::p
```

**Pros:**
- ✅ Very powerful
- ✅ Can navigate up/down DOM
- ✅ Text-based selection

**Cons:**
- ❌ Complex syntax
- ❌ Slower than CSS
- ❌ Harder to read

### Tag Name

**When to Use:** Extract all elements of a type

**Examples:**

```
Tag: h1      → All H1 headings
Tag: p       → All paragraphs
Tag: a       → All links
Tag: img     → All images
Tag: table   → All tables
```

### Class Name

**When to Use:** Select by class only

**Examples:**

```
Class: product-title    → .product-title
Class: price            → .price
Class: btn              → .btn
```

### ID

**When to Use:** Unique elements

**Examples:**

```
ID: main-content    → #main-content
ID: header          → #header
ID: footer          → #footer
```

## Extract Attributes

### Text Content

**Returns:** Visible text only

**Best For:**
- Article text
- Product titles
- Headlines
- Descriptions

**Example:**
```html
<h3 class="title">Product Name</h3>
```
**Extracts:** `Product Name`

### HTML Content

**Returns:** Full HTML including tags

**Best For:**
- Formatted content
- Structured data
- Preserving formatting

**Example:**
```html
<div class="content">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</div>
```
**Extracts:** `<p>Paragraph 1</p><p>Paragraph 2</p>`

### Href (for links)

**Returns:** URL from link

**Best For:**
- Collecting links
- Navigation URLs
- Download links

**Example:**
```html
<a href="https://example.com/product">Product</a>
```
**Extracts:** `https://example.com/product`

### Src (for images)

**Returns:** Image URL

**Best For:**
- Image collections
- Product photos
- Media galleries

**Example:**
```html
<img src="/images/product.jpg" alt="Product">
```
**Extracts:** `/images/product.jpg`

### Alt Text

**Returns:** Image alt attribute

**Best For:**
- Image descriptions
- SEO data
- Accessibility info

**Example:**
```html
<img src="photo.jpg" alt="Beautiful sunset">
```
**Extracts:** `Beautiful sunset`

### Title Attribute

**Returns:** Title/tooltip text

**Best For:**
- Tooltips
- Additional info
- Hover text

**Example:**
```html
<span title="More information">ℹ️</span>
```
**Extracts:** `More information`

## Managing Rules

### View Rules

**Location:** Extraction Rules tab

**Displays:**
- All saved rules
- Rule count
- Empty state if none

### Edit Rules

**Current Limitation:** Rules cannot be edited after creation

**Workaround:**
1. Note rule details
2. Delete old rule
3. Create new rule with corrections

### Delete Rules

**Steps:**
1. Find rule in sidebar
2. Click × (delete) button
3. Confirm deletion

**Or:**
1. Go to Extraction Rules tab
2. Find rule card
3. Click delete option

### Organize Rules

**Naming Convention:**
```
[Website] - [Data Type] - [Details]

Examples:
- Amazon - Products - Title
- Amazon - Products - Price
- News - Articles - Headline
```

**Grouping:**
- Use consistent prefixes
- Create related rules together
- Delete unused rules

## Running Rules

### Run Single Rule

**From Sidebar:**
1. Find rule in saved rules list
2. Click play button (▶)
3. Results appear in Results tab

**From Rules Tab:**
1. Find rule card
2. Click play button
3. View results

### Run All Rules

**Steps:**
1. Create multiple rules
2. Click "Run All Rules" button
3. Wait for processing
4. Review results

**Benefits:**
- One-click execution
- Consistent results
- Time-saving

### Results Display

```
┌─────────────────────────────────────────┐
│ ✓ Extraction Complete                   │
│ 4 rules executed • 40 items extracted   │
├─────────────────────────────────────────┤
│ 📖 Book Titles (10 items)               │
│ #1: A Light in the Attic               │
│ #2: Tipping the Velvet                 │
│ #3: Soumission                          │
│ ...                                     │
├─────────────────────────────────────────┤
│ 💰 Book Prices (10 items)               │
│ #1: £51.77                             │
│ #2: £53.74                             │
│ ...                                     │
└─────────────────────────────────────────┘
```

## Advanced Techniques

### Combining Selectors

**Multiple Classes:**
```css
.product-card.highlighted h3
```

**Attribute + Class:**
```css
a.product-link[href^="/products"]
```

**Pseudo-classes:**
```css
.product-card:first-child h3
.product-card:nth-child(2n) .price
```

### Handling Variations

**Multiple Selectors for Same Data:**
```
Rule 1: .product-title
Rule 2: .item-title
Rule 3: h3.title

Run all to catch variations
```

### Conditional Extraction

**Extract Different Attributes:**
```
Same Selector: .product-card
Rule 1: Extract Text (title)
Rule 2: Extract Href (link)
Rule 3: Extract Src (image)
```

### Nested Data

**Parent-Child Relationships:**
```css
/* All prices in product card */
.product-card .price

/* Direct child only */
.product-card > .price

/* Specific descendant */
.product-card .info .price
```

## Best Practices

### ✅ Do's

- Use descriptive rule names
- Test rules before batch running
- Start with CSS selectors
- Keep selectors simple
- Document complex rules
- Save rules for reuse
- Export results regularly

### ❌ Don'ts

- Don't use overly complex selectors
- Don't skip testing
- Don't use fragile selectors (nth-child without context)
- Don't forget to save important rules
- Don't ignore failed extractions

## Troubleshooting

### Rule Returns No Results

**Causes:**
- Wrong selector
- Element not on page
- Page changed

**Solutions:**
1. Verify selector in browser
2. Re-scrape the page
3. Check for page updates
4. Try different selector type

### Rule Returns Wrong Data

**Causes:**
- Selector too broad
- Wrong attribute selected
- Multiple elements match

**Solutions:**
1. Make selector more specific
2. Change extract attribute
3. Add parent context to selector

### Rule Works Sometimes

**Causes:**
- Dynamic content
- A/B testing on site
- Inconsistent HTML

**Solutions:**
1. Increase wait time
2. Create multiple rules for variations
3. Use more flexible selectors

---

**Next:** Learn about [Export Data](export-data.md) options.
