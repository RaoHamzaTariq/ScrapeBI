# Visual Selector Guide

Master ScrapeBI's visual element selector for intuitive web scraping.

## Table of Contents

- [What is Visual Selector?](#what-is-visual-selector)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Selecting Elements](#selecting-elements)
- [Element Details Panel](#element-details-panel)
- [Creating Rules from Selection](#creating-rules-from-selection)
- [Tips & Tricks](#tips--tricks)
- [Troubleshooting](#troubleshooting)

## What is Visual Selector?

The Visual Selector is ScrapeBI's flagship feature that lets you select web elements by clicking on them directly in a live preview - no coding required!

### Benefits

| Traditional Scraping | Visual Selector |
|---------------------|-----------------|
| Write CSS/XPath code | Click on elements |
| Guess element positions | See elements visually |
| Test in browser console | Instant preview |
| Learn selector syntax | Point and click |

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  1. Scrape Website                                      │
│     ↓                                                   │
│  2. Page loads in iframe preview                        │
│     ↓                                                   │
│  3. Hover over elements → Blue highlight                │
│     ↓                                                   │
│  4. Click element → Green highlight + Details panel     │
│     ↓                                                   │
│  5. Create extraction rule automatically                │
└─────────────────────────────────────────────────────────┘
```

## Getting Started

### Step 1: Scrape a Website

1. Enter URL in the input field
2. Set appropriate wait time
3. Click "Scrape" button
4. Wait for page to load in preview

### Step 2: Open Visual Selector

- Click the **"Visual Selector"** tab
- Page preview appears in iframe
- Ready for element selection

### Step 3: Start Selecting

- Hover over any element to highlight it
- Click to select
- View element details below preview

## Selecting Elements

### Hover to Highlight

When you hover over elements:

```
┌─────────────────────────────────┐
│  [Element with blue outline]    │
│  ← Mouse cursor                 │
└─────────────────────────────────┘
       ↑
   Blue outline (2px solid #3b82f6)
   Cursor changes to pointer
```

### Click to Select

When you click an element:

```
┌─────────────────────────────────┐
│  [Element with green outline]   │
│  ← Selected element             │
└─────────────────────────────────┘
       ↑
   Green outline (3px solid #10b981)
   Element info appears below
```

### Selection Behavior

| Action | Result |
|--------|--------|
| Hover | Blue outline |
| Click | Green outline + Details panel |
| Click different element | New selection |
| Click outside | Clear selection |
| Refresh | Clear all selections |

## Element Details Panel

After selecting an element, the details panel shows:

```
✓ Element Selected
─────────────────────────────────────
Tag: H3
Class: product-title
ID: product-123
Text: "Amazing Product Name"
Selector: .product-card h3
─────────────────────────────────────
[Create Extraction Rule] [Clear]
```

### Information Displayed

| Field | Description | Example |
|-------|-------------|---------|
| Tag | HTML tag name | `H3`, `DIV`, `A` |
| Class | CSS classes | `product-title` |
| ID | Element ID | `main-content` |
| Text | Text content | "Product Name" |
| Selector | Auto-generated CSS | `.card h3` |

### Using the Information

1. **Verify Selection**
   - Check text matches what you want
   - Confirm tag is correct

2. **Review Selector**
   - See auto-generated CSS selector
   - Use as-is or customize

3. **Create Rule**
   - Click "Create Extraction Rule"
   - Pre-fills selector information

## Creating Rules from Selection

### Quick Create

1. Select element visually
2. Click "Create Extraction Rule"
3. Enter rule name
4. Click "Save Rule"

### Rule Auto-Population

When creating from selection:

```
Rule Name: [Enter manually]
Selector Type: CSS Selector ← Auto-selected
Selector: .product-card h3 ← Auto-filled
Extract: Text Content ← Default
```

### Customizing Auto-Generated Rules

You can modify any field:

1. **Change Selector Type**
   - Switch to XPath if needed
   - Use Tag Name for all elements

2. **Edit Selector**
   - Make more specific
   - Make more general

3. **Change Extract Attribute**
   - Text → HTML
   - Text → Href (for links)
   - Text → Src (for images)

## Tips & Tricks

### ✅ Pro Tips

#### 1. Select Specific Elements

**Problem:** Multiple similar elements

**Solution:** 
- Click the exact element you want
- Note the full selector path
- Use parent classes for specificity

```
Instead of: h3
Use: .product-card h3
```

#### 2. Handle Nested Elements

**Problem:** Text inside multiple containers

**Solution:**
- Click innermost element with your text
- Check selector includes parent context

```
<div class="product">
  <div class="info">
    <h3>Title</h3>  ← Select this
  </div>
</div>

Selector: .product .info h3
```

#### 3. Select Links

**For URLs:**
1. Click the link text
2. Create rule
3. Change "Extract" to "Href"

**For Link Text:**
1. Click the link text
2. Keep "Extract" as "Text Content"

#### 4. Select Images

**For Image URLs:**
1. Click the image
2. Create rule
3. Change "Extract" to "Src"

**For Alt Text:**
1. Click the image
2. Change "Extract" to "Alt"

### ⚡ Efficiency Tips

#### Batch Similar Elements

Select one element, then modify selector for all:

```
Selected: .product-card-1 h3
Modified: .product-card h3  ← Works for all
```

#### Use Element List Alongside

1. Visual Selector for exploration
2. Element List for verification
3. Switch between tabs as needed

#### Test Before Saving

1. Create rule
2. Run immediately
3. Check results
4. Adjust if needed

## Troubleshooting

### Element Not Highlighting

**Problem:** Hover doesn't show blue outline

**Solutions:**
1. Refresh the preview
2. Check if element is inside iframe
3. Try Element List instead
4. Some elements may be protected

### Wrong Element Selected

**Problem:** Click selects different element

**Solutions:**
1. Try clicking more precisely
2. Use Element List for accuracy
3. Check parent/child relationships
4. Use browser DevTools to inspect

### Selection Not Working

**Problem:** Clicks don't register

**Solutions:**
1. Wait for page to fully load
2. Increase wait time and re-scrape
3. Clear selection and try again
4. Refresh preview

### Element Details Empty

**Problem:** Details panel shows nothing

**Solutions:**
1. Click element again
2. Check if element has content
3. Try different element
4. Some elements may be empty

### Preview Not Loading

**Problem:** Visual Selector shows "No Preview"

**Solutions:**
1. Scrape a website first
2. Check scraping completed successfully
3. Try different website
4. Some sites block preview

## Advanced Techniques

### Selecting Dynamic Content

For JavaScript-loaded content:

1. **Increase Wait Time**
   - Give time for content to load
   - Try 5-10 seconds

2. **Scroll Before Selection**
   - Some content loads on scroll
   - Use Element List instead

### Selecting Table Data

```
Table Structure:
┌─────────┬─────────┬─────────┐
│ Header1 │ Header2 │ Header3 │
├─────────┼─────────┼─────────┤
│ Cell1   │ Cell2   │ Cell3   │
└─────────┴─────────┴─────────┘
```

**Select Specific Column:**
```
Selector: table tr td:nth-child(2)
Extracts: Second column cells
```

### Selecting List Items

```
List Structure:
• Item 1
• Item 2
• Item 3
```

**Select All Items:**
```
Selector: ul li
Extract: Text Content
```

### Selecting Form Elements

**Input Fields:**
```
Selector: input[name="email"]
Extract: Value or Placeholder
```

**Buttons:**
```
Selector: button[type="submit"]
Extract: Text Content
```

## Best Practices

### ✅ Do's

- Take time to select accurately
- Verify selector before saving
- Test rules immediately
- Use descriptive rule names
- Save frequently used selectors

### ❌ Don'ts

- Don't rush selection
- Don't ignore selector accuracy
- Don't skip testing
- Don't use vague rule names
- Don't forget to save

---

**Next:** Learn about [Extraction Rules](extraction-rules.md) in detail.
