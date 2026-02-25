# Batch Processing Guide

Run multiple extraction rules efficiently for large-scale data extraction.

## Table of Contents

- [What is Batch Processing?](#what-is-batch-processing)
- [When to Use Batch Processing](#when-to-use-batch-processing)
- [Setting Up Batch Extraction](#setting-up-batch-extraction)
- [Running Batch Extractions](#running-batch-extractions)
- [Managing Results](#managing-results)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## What is Batch Processing?

Batch processing allows you to run multiple extraction rules simultaneously, extracting all your data in one operation instead of running rules one by one.

### Single vs Batch Processing

| Single Rule | Batch Processing |
|-------------|------------------|
| Run one rule at a time | Run all rules together |
| Multiple clicks | One click |
| Slower overall | Faster overall |
| Good for testing | Good for production |

### How It Works

```
1. Create Multiple Rules
   ├─ Rule 1: Product Titles
   ├─ Rule 2: Product Prices
   ├─ Rule 3: Product Images
   └─ Rule 4: Product Ratings
         ↓
2. Click "Run All Rules"
         ↓
3. All Rules Execute Together
         ↓
4. Results Displayed Organized by Rule
```

## When to Use Batch Processing

### ✅ Ideal Scenarios

**Complete Data Extraction:**
- Need all available data from page
- Multiple data points per item
- Building comprehensive datasets

**Production Scraping:**
- Rules tested and verified
- Regular scraping schedule
- Automated workflows

**Large-Scale Extraction:**
- Many products/items to extract
- Multiple data fields
- Time-sensitive collection

### ⚠️ When Not to Use

**Testing Phase:**
- Still developing rules
- Verifying selectors
- Debugging extraction

**Single Data Point:**
- Only need one type of data
- Quick extraction
- Simple use case

## Setting Up Batch Extraction

### Step 1: Create Rules

Create all rules you want to run:

```
Example: E-commerce Product Page

Rule 1: Product Titles
  Selector: .product-card h3
  Extract: Text

Rule 2: Product Prices
  Selector: .product-price
  Extract: Text

Rule 3: Product Images
  Selector: .product-card img
  Extract: Src

Rule 4: Product Ratings
  Selector: .star-rating
  Extract: Title

Rule 5: Product Links
  Selector: .product-card a
  Extract: Href
```

### Step 2: Verify Rules

Check rules in sidebar:
```
📑 Saved Rules
├─ ✓ Product Titles
├─ ✓ Product Prices
├─ ✓ Product Images
├─ ✓ Product Ratings
└─ ✓ Product Links
```

### Step 3: Organize Rules

**Naming Convention:**
```
[Category] - [Data Type]

Examples:
- Product - Title
- Product - Price
- Product - Image
- Product - Rating
```

## Running Batch Extractions

### Method 1: Run All Rules Button

**Steps:**

1. **Ensure Rules Created**
   - Rules appear in sidebar
   - All rules verified

2. **Click "Run All Rules"**
   - Large blue button in sidebar
   - All rules execute

3. **Wait for Completion**
   - Processing indicator
   - Results appear in Results tab

### Method 2: Individual Rule Execution

**For Selective Running:**

1. **Find Rule in Sidebar**
2. **Click Play Button (▶)**
3. **Only That Rule Runs**

**Use When:**
- Testing specific rule
- Updating single data type
- Debugging

### Processing Indicators

```
┌─────────────────────────────────────────┐
│ Running Extraction...                   │
├─────────────────────────────────────────┤
│ Processing Rules:                       │
│ ✓ Product Titles (10 items)            │
│ ✓ Product Prices (10 items)            │
│ ⏳ Product Images (processing)          │
│ ⏳ Product Ratings (pending)            │
│ ⏳ Product Links (pending)              │
└─────────────────────────────────────────┘
```

## Managing Results

### Results Display

After batch extraction:

```
┌─────────────────────────────────────────┐
│ ✓ Extraction Complete                   │
│ 5 rules executed • 50 items extracted   │
├─────────────────────────────────────────┤
│ 📦 Product - Title (10 items)           │
│ #1: Amazing Product A                   │
│ #2: Amazing Product B                   │
│ ...                                     │
├─────────────────────────────────────────┤
│ 💰 Product - Price (10 items)           │
│ #1: $29.99                              │
│ #2: $39.99                              │
│ ...                                     │
├─────────────────────────────────────────┤
│ 🖼️ Product - Image (10 items)           │
│ #1: /images/product-a.jpg               │
│ #2: /images/product-b.jpg               │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Results Summary

**Header Shows:**
- ✓ or ✗ Status
- Number of rules executed
- Total items extracted

**Per Rule Shows:**
- Rule name with icon
- Item count
- Individual results

### Exporting Batch Results

**All Results Together:**

1. **Go to Results Tab**
2. **Click Export Format**
   - JSON: All rules in one file
   - CSV: Flat table with rule column
   - TXT: Organized by rule

**JSON Export Structure:**
```json
{
  "Product - Title": [...],
  "Product - Price": [...],
  "Product - Image": [...],
  "Product - Rating": [...],
  "Product - Link": [...]
}
```

**CSV Export Structure:**
```csv
rule,index,value
Product - Title,1,Amazing Product A
Product - Title,2,Amazing Product B
Product - Price,1,$29.99
Product - Price,2,$39.99
```

## Performance Optimization

### Wait Time Optimization

**Too Short:**
```
❌ Missing data
❌ Incomplete extraction
❌ Need to re-run
```

**Too Long:**
```
❌ Wasted time
❌ Slower processing
❌ Inefficient
```

**Optimal:**
```
✅ Complete data
✅ Efficient timing
✅ Consistent results
```

### Rule Ordering

**Group Related Rules:**
```
Product Information:
- Title
- Price
- Image
- Description

Product Metadata:
- SKU
- Category
- Tags
- Rating
```

### Memory Management

**For Large Extractions:**

1. **Export Regularly**
   - Don't let results accumulate
   - Export after each batch

2. **Clear Old Results**
   - Refresh page periodically
   - Start fresh for new scraping

3. **Limit Rule Count**
   - 10-20 rules per batch optimal
   - Split large rule sets

## Best Practices

### ✅ Do's

#### 1. Test Rules Individually First
```
Before batch running:
- Test each rule separately
- Verify all selectors work
- Check data accuracy
```

#### 2. Use Consistent Naming
```
Good:
- Product - Title
- Product - Price
- Product - Image

Bad:
- Titles
- Stuff
- Rule 1
```

#### 3. Organize by Data Type
```
Group related rules:
- All product data together
- All navigation data together
- All metadata together
```

#### 4. Export Immediately
```
After batch extraction:
- Export results
- Save to file
- Clear for next batch
```

#### 5. Monitor Performance
```
Track:
- Extraction time
- Success rate
- Data completeness
- Errors encountered
```

### ❌ Don'ts

#### 1. Don't Skip Testing
```
❌ Create 20 rules → Run all → Hope for best
✅ Create rule → Test → Repeat → Run all
```

#### 2. Don't Mix Incompatible Rules
```
❌ Rules for different pages together
✅ Rules for same page together
```

#### 3. Don't Ignore Errors
```
❌ Some rules fail → Ignore → Continue
✅ Some rules fail → Fix → Re-run
```

#### 4. Don't Overload
```
❌ 50+ rules in one batch
✅ 10-20 rules per batch
```

## Troubleshooting

### Some Rules Fail

**Problem:** Only some rules extract data

**Diagnosis:**
```
1. Check which rules failed
2. Verify selectors still valid
3. Check if page changed
4. Test failed rules individually
```

**Solutions:**
1. Update failed rule selectors
2. Re-run batch
3. Remove problematic rules
4. Create alternative selectors

### Inconsistent Results

**Problem:** Different results each run

**Causes:**
- Dynamic website content
- A/B testing
- Timing issues

**Solutions:**
1. Increase wait time
2. Run multiple times
3. Average results
4. Note variations

### Slow Performance

**Problem:** Batch takes too long

**Causes:**
- Too many rules
- Slow website
- Low resources

**Solutions:**
1. Reduce rule count per batch
2. Optimize wait time
3. Close other applications
4. Split into multiple batches

### Memory Issues

**Problem:** Browser slows or crashes

**Solutions:**
1. Export and clear results
2. Refresh page
3. Reduce batch size
4. Restart browser

## Advanced Techniques

### Conditional Batch Processing

**Different Batches for Different Pages:**
```
Batch 1: Product Pages
- Title
- Price
- Image

Batch 2: Category Pages
- Category Name
- Product Count
- Filter Options
```

### Chained Extractions

**Use Results from One Batch:**
```
Batch 1: Extract Product Links
  ↓
Use Links for Next Batch
  ↓
Batch 2: Scrape Each Product Page
```

### Scheduled Batch Processing

**For Regular Scraping:**
```
1. Create rule set
2. Save rule configuration
3. Run on schedule
4. Export automatically
```

## Use Cases

### E-commerce Monitoring

```
Rules:
- Product Title
- Current Price
- Original Price (discount)
- Stock Status
- Customer Rating
- Review Count

Run: Daily
Output: CSV for analysis
```

### Price Tracking

```
Rules:
- Product Name
- Price
- Availability
- Seller Name

Run: Multiple times daily
Output: JSON for database
```

### Content Aggregation

```
Rules:
- Article Title
- Author
- Publish Date
- Category
- Summary

Run: Hourly
Output: JSON for feed
```

---

**Next:** Learn about [Best Practices](best-practices.md) for effective scraping.
