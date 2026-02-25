# Dynamic Websites Guide

Scrape JavaScript-heavy websites that load content dynamically.

## Table of Contents

- [What are Dynamic Websites?](#what-are-dynamic-websites)
- [How ScrapeBI Handles Dynamic Content](#how-scrapebi-handles-dynamic-content)
- [Wait Time Configuration](#wait-time-configuration)
- [Common Dynamic Patterns](#common-dynamic-patterns)
- [Troubleshooting Dynamic Sites](#troubleshooting-dynamic-sites)
- [Advanced Techniques](#advanced-techniques)

## What are Dynamic Websites?

Dynamic websites use JavaScript to load content after the initial page load, rather than having all content in the initial HTML.

### Static vs Dynamic

| Static Website | Dynamic Website |
|----------------|-----------------|
| Content in HTML | Content loaded via JavaScript |
| Fast to scrape | Needs wait time |
| Simple structure | Complex structure |
| Example: Wikipedia | Example: Twitter, Facebook |

### Common Dynamic Patterns

```
1. Infinite Scroll
   └─ Content loads as you scroll

2. Load More Button
   └─ Click to load more items

3. AJAX Loading
   └─ Content fetches after page load

4. Single Page App (SPA)
   └─ Entire app in one page

5. Lazy Loading
   └─ Images/content load when visible
```

## How ScrapeBI Handles Dynamic Content

### Selenium Automation

ScrapeBI uses Selenium WebDriver which:
- ✅ Executes JavaScript
- ✅ Waits for page load
- ✅ Renders dynamic content
- ✅ Handles AJAX requests

### Process Flow

```
1. User enters URL
       ↓
2. Selenium launches Chrome
       ↓
3. Page loads with JavaScript
       ↓
4. Wait time allows dynamic content
       ↓
5. Full rendered HTML captured
       ↓
6. Elements available for selection
```

## Wait Time Configuration

### Understanding Wait Time

Wait time is how long ScrapeBI waits after page load before capturing content.

### Recommended Wait Times

| Website Type | Wait Time | Example |
|--------------|-----------|---------|
| Static | 1-2 seconds | Wikipedia |
| Standard | 3-5 seconds | News sites |
| Dynamic | 5-8 seconds | E-commerce |
| Heavy JS | 8-10 seconds | SPAs, Dashboards |

### Setting Wait Time

```
┌─────────────────────────────────────────┐
│  🔗 https://example.com  ⏱️ [5]s  [Scrape] │
└─────────────────────────────────────────┘
                            ↑
                    Adjust wait time here
```

### Wait Time Tips

**Too Short:**
- ❌ Missing content
- ❌ Empty elements
- ❌ Incomplete data

**Too Long:**
- ⏱️ Wasted time
- ⏱️ Slower scraping

**Just Right:**
- ✅ All content loaded
- ✅ Efficient scraping
- ✅ Complete data

## Common Dynamic Patterns

### 1. Infinite Scroll

**Description:** Content loads as user scrolls down

**Examples:** Twitter, Instagram, Pinterest

**Challenges:**
- Content not all loaded initially
- Need to scroll to trigger loads

**Solutions:**

**Option A: Increase Wait Time**
```
Wait Time: 8-10 seconds
May capture initial scroll load
```

**Option B: Multiple Scrapes**
```
1. Scrape page 1
2. Note last item
3. Find page 2 URL
4. Scrape page 2
5. Combine results
```

### 2. Load More Button

**Description:** Click button to load more content

**Examples:** Search results, product listings

**Challenges:**
- Requires interaction
- Multiple clicks for all content

**Solutions:**

**Option A: Wait for Initial Load**
```
Wait Time: 5 seconds
Capture initially loaded items
```

**Option B: Find Pagination**
```
Look for page numbers
Scrape each page URL separately
```

### 3. AJAX Content Loading

**Description:** Content fetches after page load

**Examples:** News feeds, dashboards

**Challenges:**
- Content appears after delay
- May need multiple waits

**Solutions:**

**Increase Wait Time:**
```
Standard: 3 seconds
AJAX: 5-7 seconds
```

**Look for Loading Indicators:**
```
Wait for spinner to disappear
Content should be loaded
```

### 4. Single Page Applications (SPA)

**Description:** Entire app loads in one page

**Examples:** Gmail, Trello, Asana

**Challenges:**
- Complex JavaScript
- Route-based content
- Authentication required

**Solutions:**

**Wait for Full Load:**
```
Wait Time: 8-10 seconds
Ensure all JS executed
```

**Use Specific URLs:**
```
Navigate to specific view
Scrape that view's content
```

### 5. Lazy Loading

**Description:** Content loads when visible

**Examples:** Image galleries, long articles

**Challenges:**
- Content below fold not loaded
- Need to scroll

**Solutions:**

**Increase Browser Size:**
```
More content visible initially
More content loads
```

**Longer Wait Time:**
```
Some lazy loading triggers on time
7-10 seconds may help
```

## Troubleshooting Dynamic Sites

### Content Missing

**Problem:** Expected content not in preview

**Diagnosis:**
```
1. Open URL in regular Chrome
2. Check if content exists
3. Note how long it takes to load
4. Compare with ScrapeBI preview
```

**Solutions:**
1. Increase wait time
2. Check if content requires login
3. Verify site doesn't block bots
4. Try Element List instead of Visual

### Elements Not Selectable

**Problem:** Can't click elements in preview

**Solutions:**
1. Use Element List tab
2. Elements may be in iframe
3. Site may block interaction
4. Try different browser

### Preview Shows Error

**Problem:** Application error in preview

**Solutions:**
1. Check browser console (F12)
2. Site may have CSP restrictions
3. Use Element List instead
4. Try scraping different page

### Inconsistent Results

**Problem:** Different results each scrape

**Causes:**
- Dynamic content varies
- A/B testing on site
- Timing issues

**Solutions:**
1. Increase wait time consistency
2. Scrape multiple times
3. Average the results
4. Note variations

## Advanced Techniques

### Finding Dynamic Selectors

**Problem:** Selectors change on reload

**Solution:**
```css
/* Bad: Dynamic class */
.css-1a2b3c4

/* Good: Stable attribute */
[data-testid="product-title"]

/* Better: Structural */
.product-card h3
```

### Handling Multiple States

**Loading State:**
```html
<div class="loading">Loading...</div>
```

**Loaded State:**
```html
<div class="product-list">...</div>
```

**Strategy:**
```
Wait for loaded state elements
Ignore loading indicators
```

### Detecting Load Completion

**Visual Indicators:**
- Spinner disappears
- Loading text gone
- Content appears

**DOM Indicators:**
- Specific element appears
- Loading class removed
- Data attributes populated

### Working with APIs

Some dynamic sites fetch from APIs:

**Find API Endpoints:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Find data requests

**Alternative Approach:**
```
Instead of scraping HTML:
1. Find API endpoint
2. Call API directly
3. Parse JSON response
(May require authentication)
```

## Best Practices

### ✅ Do's

- Start with longer wait times
- Verify content in regular browser first
- Use Element List for difficult sites
- Test multiple times for consistency
- Check for pagination options
- Look for mobile versions (simpler)

### ❌ Don'ts

- Don't assume all content loads immediately
- Don't ignore loading indicators
- Don't scrape too quickly
- Don't ignore robots.txt
- Don't overload servers

## Site-Specific Tips

### E-commerce Sites

```
Wait Time: 5-7 seconds
Look for: Product grids, prices
Watch for: Lazy-loaded images
```

### Social Media

```
Wait Time: 7-10 seconds
Look for: Post containers
Watch for: Infinite scroll
Note: Often blocks scrapers
```

### News Sites

```
Wait Time: 3-5 seconds
Look for: Article containers
Watch for: Ad placeholders
Tip: AMP versions simpler
```

### Search Results

```
Wait Time: 5-7 seconds
Look for: Result containers
Watch for: Pagination
Tip: Use page parameters in URL
```

## Alternative Approaches

### When Scraping Fails

**1. RSS Feeds**
```
Many sites have RSS
URL: site.com/rss or site.com/feed
Easier to parse than HTML
```

**2. Sitemaps**
```
URL: site.com/sitemap.xml
Lists all pages
Good for finding URLs
```

**3. APIs**
```
Some sites offer public APIs
Check documentation
May require API key
```

**4. Data Services**
```
Consider data providers
May have existing datasets
Could be more reliable
```

---

**Next:** Learn about [Batch Processing](batch-processing.md) for efficient scraping.
