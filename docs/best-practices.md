# Best Practices Guide

Follow these guidelines for effective, efficient, and ethical web scraping.

## Table of Contents

- [Ethical Scraping](#ethical-scraping)
- [Technical Best Practices](#technical-best-practices)
- [Performance Optimization](#performance-optimization)
- [Data Quality](#data-quality)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Maintenance Tips](#maintenance-tips)

## Ethical Scraping

### Respect robots.txt

**What is robots.txt?**
- File that tells scrapers what's allowed
- Located at: `website.com/robots.txt`
- Industry standard for scraping permissions

**How to Check:**
```
1. Open browser
2. Go to: https://example.com/robots.txt
3. Review allowed/disallowed paths
```

**Example robots.txt:**
```
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/
Allow: /products/
```

**Best Practice:**
```
✅ Scrape allowed paths
❌ Avoid disallowed paths
⚠️ When in doubt, ask permission
```

### Follow Terms of Service

**Read ToS Before Scraping:**
- Check website's terms of service
- Look for scraping clauses
- Note any restrictions

**Common Restrictions:**
```
❌ No automated access
❌ No commercial use
❌ Rate limiting required
✅ Public data OK
✅ Personal use OK
```

### Be Respectful to Servers

**Don't Overload:**
```
❌ Rapid-fire requests
❌ Multiple concurrent scrapers
❌ Ignoring rate limits

✅ Reasonable delays between requests
✅ Single instance scraping
✅ Respect server
```

**Recommended Delays:**
```
Small sites: 5-10 seconds between scrapes
Medium sites: 3-5 seconds between scrapes
Large sites: 1-2 seconds between scrapes
```

### Use Data Responsibly

**Copyright Considerations:**
```
✅ Facts and data (generally not copyrightable)
❌ Creative content (articles, images)
⚠️ Check local laws
```

**Privacy Considerations:**
```
❌ Don't scrape personal data without consent
❌ Don't scrape sensitive information
✅ Respect GDPR and privacy laws
```

## Technical Best Practices

### Selector Design

**Use Stable Selectors:**
```css
/* ✅ Good: Semantic classes */
.product-title
.price
.article-content

/* ❌ Bad: Auto-generated classes */
.css-1a2b3c4
#element-5f8d9a

/* ⚠️ Fragile: Structural selectors */
div:nth-child(3) > span
```

**Be Specific But Flexible:**
```css
/* Too broad */
.title

/* Too specific (breaks easily) */
div.container > div.row:nth-child(2) > h1

/* Just right */
.product-card .product-title
```

### Wait Time Strategy

**Start Conservative:**
```
Initial: 5 seconds
Observe: What loads when
Adjust: Based on observation
```

**Website Categories:**
```
Static (blogs, wiki): 2-3 seconds
Standard (news, basic): 3-5 seconds
Dynamic (e-commerce): 5-7 seconds
Heavy JS (SPAs): 8-10 seconds
```

### Rule Organization

**Naming Convention:**
```
[Site] - [Section] - [Data Type]

Examples:
- Amazon - Product - Title
- Amazon - Product - Price
- News - Article - Headline
```

**Group Related Rules:**
```
Product Data:
├─ Product - Title
├─ Product - Price
├─ Product - Image
└─ Product - Description

Metadata:
├─ Product - SKU
├─ Product - Category
└─ Product - Tags
```

### Export Strategy

**Regular Exports:**
```
✅ Export after each successful scrape
✅ Save with timestamp
✅ Keep organized folder structure
```

**File Naming:**
```
✅ scraped_amazon_products_2026-02-25.json
✅ news_articles_20260225.csv
❌ data.json
❌ export1.csv
```

**Backup Important Data:**
```
Primary: Local export
Backup: Cloud storage
Archive: Long-term storage
```

## Performance Optimization

### Efficient Scraping

**Minimize Wait Time:**
```
Test different wait times
Find minimum for complete data
Use that consistently
```

**Batch Similar Pages:**
```
Instead of: Scrape each product page individually
Better: Scrape category page with all products
```

**Use Quick Extract:**
```
For common elements use sidebar shortcuts:
- All Headings
- All Links
- All Images
```

### Resource Management

**Browser Resources:**
```
✅ Close unused tabs
✅ Clear cache periodically
✅ Restart browser after heavy use
```

**Memory Management:**
```
✅ Export results regularly
✅ Refresh page between large jobs
✅ Limit concurrent rules (10-20 optimal)
```

**System Resources:**
```
✅ Close unnecessary applications
✅ Ensure adequate RAM (4GB+ recommended)
✅ Use stable internet connection
```

### Caching Strategy

**For Repeated Scraping:**
```
1. First scrape: Full extraction
2. Save rules
3. Subsequent: Reuse rules
4. Export each time
```

**Rule Library:**
```
Build collection of working rules:
- Document each rule
- Note website
- Record date created
- Update as needed
```

## Data Quality

### Verify Data Accuracy

**Spot Check Results:**
```
1. Compare with original page
2. Verify all expected data present
3. Check for missing items
4. Validate data types
```

**Sample Validation:**
```
Before: Export entire dataset
After: Export sample, verify, then full export
```

### Handle Missing Data

**Identify Gaps:**
```
Check for:
- Empty results
- Fewer items than expected
- Inconsistent formatting
```

**Solutions:**
```
1. Re-scrape page
2. Adjust selectors
3. Increase wait time
4. Try alternative selectors
```

### Data Cleaning

**Common Issues:**
```
Whitespace: "  Text  " → "Text"
Encoding: "CafÃ©" → "Café"
HTML entities: "&amp;" → "&"
Currency: "$ 29.99" → "$29.99"
```

**Cleaning Tools:**
```
Excel/Sheets: TRIM(), CLEAN()
Python: str.strip(), str.encode()
Online: Text cleanup tools
```

## Error Handling

### Common Errors

**Selector Errors:**
```
Problem: No results
Cause: Selector doesn't match
Fix: Update selector
```

**Timeout Errors:**
```
Problem: Page doesn't load
Cause: Slow website
Fix: Increase wait time
```

**Session Errors:**
```
Problem: Session expired
Cause: Old session
Fix: Re-scrape page
```

### Debugging Process

**Step-by-Step:**
```
1. Identify error type
2. Check error message
3. Verify page loaded
4. Test selector in browser
5. Try alternative approach
```

**Browser DevTools:**
```
1. Open website in Chrome
2. Press F12
3. Inspect element
4. Test selector in console
5. Copy working selector
```

### Fallback Strategies

**Primary Selector Fails:**
```
Have backup selectors ready:
Primary: .product-title
Fallback 1: .item-title
Fallback 2: h3.product-name
```

**Multiple Approaches:**
```
Create rules for variations:
- Different page layouts
- A/B test versions
- Mobile vs desktop
```

## Security Considerations

### Safe Scraping Practices

**Protect Your Identity:**
```
✅ Use standard user agent (ScrapeBI default)
✅ Reasonable request frequency
✅ Respect rate limits
```

**Avoid Detection:**
```
✅ Scrape during off-peak hours
✅ Add delays between requests
✅ Don't scrape too much too fast
```

### Data Security

**Protect Scraped Data:**
```
✅ Store securely
✅ Encrypt sensitive data
✅ Limit access
✅ Delete when no longer needed
```

**API Keys & Credentials:**
```
❌ Never commit to code
❌ Never share publicly
✅ Use environment variables
✅ Keep separate from project
```

### Legal Considerations

**Understand Your Rights:**
```
✅ Public data generally OK to scrape
✅ Your own data always OK
⚠️ Check local laws
⚠️ Consult legal for commercial use
```

**Respect Boundaries:**
```
❌ Don't bypass authentication
❌ Don't scrape behind login without permission
❌ Don't overload servers
✅ Do respect copyright
✅ Do follow terms of service
```

## Maintenance Tips

### Regular Updates

**Check Rules Periodically:**
```
Monthly review:
- Test all saved rules
- Update broken selectors
- Remove obsolete rules
- Add new rules as needed
```

**Monitor Target Websites:**
```
Watch for:
- Design changes
- Layout updates
- New data fields
- Removed elements
```

### Documentation

**Keep Records:**
```
For each rule:
- Purpose
- Selector used
- Date created
- Last verified
- Notes
```

**Change Log:**
```
Track updates:
- When rule changed
- Why changed
- What changed
```

### Version Control

**For Rule Sets:**
```
Export rule configurations
Save with dates
Keep backup copies
Document versions
```

## Quick Reference

### Do's Checklist

- [ ] Check robots.txt
- [ ] Read terms of service
- [ ] Use stable selectors
- [ ] Set appropriate wait times
- [ ] Export regularly
- [ ] Verify data quality
- [ ] Document rules
- [ ] Respect rate limits
- [ ] Test before batch running
- [ ] Keep backups

### Don'ts Checklist

- [ ] Don't overload servers
- [ ] Don't scrape personal data
- [ ] Don't ignore errors
- [ ] Don't use fragile selectors
- [ ] Don't skip testing
- [ ] Don't forget to export
- [ ] Don't scrape disallowed paths
- [ ] Don't use for spam
- [ ] Don't violate copyright
- [ ] Don't share sensitive data

---

**Next:** Explore the [API Reference](api-reference.md) for programmatic access.
