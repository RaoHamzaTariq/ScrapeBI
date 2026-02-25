# Advanced Selectors Guide

Master CSS and XPath selectors to extract data precisely from any website.

## Table of Contents

- [Introduction to Selectors](#introduction-to-selectors)
- [CSS Selector Basics](#css-selector-basics)
- [Advanced CSS Selectors](#advanced-css-selectors)
- [XPath Basics](#xpath-basics)
- [Advanced XPath](#advanced-xpath)
- [Selector Examples](#selector-examples)
- [Best Practices](#best-practices)

## Introduction to Selectors

Selectors are patterns used to target specific HTML elements on a webpage. ScrapeBI supports:

1. **CSS Selectors** - Fast and recommended for most cases
2. **XPath** - More powerful for complex selections
3. **Tag Name** - Simple element targeting
4. **Class Name** - Target by CSS class
5. **ID** - Target by element ID

## CSS Selector Basics

### Element Selectors

```css
/* Select all <p> elements */
p

/* Select all <a> elements */
a

/* Select all <div> elements */
div
```

### Class Selectors

```css
/* Select elements with class "product" */
.product

/* Select div with class "container" */
div.container

/* Select elements with multiple classes */
.product.title
```

### ID Selectors

```css
/* Select element with id "main" */
#main

/* Select div with id "content" */
div#content
```

### Attribute Selectors

```css
/* Select elements with href attribute */
a[href]

/* Select elements with specific href value */
a[href="https://example.com"]

/* Select elements starting with */
a[href^="https"]

/* Select elements ending with */
img[src$=".png"]

/* Select elements containing */
a[href*="example"]
```

## Advanced CSS Selectors

### Combinators

```css
/* Direct child */
div > p

/* Descendant (any level) */
div p

/* Adjacent sibling */
h1 + p

/* General sibling */
h1 ~ p
```

### Pseudo-classes

```css
/* First child */
.product:first-child

/* Last child */
.product:last-child

/* Nth child */
.product:nth-child(2)

/* Hover state */
a:hover

/* Visited links */
a:visited
```

### Attribute Contains

```css
/* Data attribute exists */
[data-id]

/* Specific data attribute */
[data-product="book"]

/* Class contains word */
[class~="active"]
```

## XPath Basics

### Basic XPath

```xpath
// Select all div elements
//div

// Select all links
//a

// Select element by ID
//*[@id="main"]

// Select element by class
//*[@class="product"]
```

### Path Types

```xpath
/* Absolute path (from root) */
/html/body/div[1]/div[2]/h1

/* Relative path (anywhere) */
//div[@class="product"]

/* Current node */
.
```

### Predicates

```xpath
/* First product */
//product[1]

/* Last product */
//product[last()]

/* Product with price > 10 */
//product[price > 10]
```

## Advanced XPath

### Axes

```xpath
/* Child axis */
/div/child::*

/* Parent axis */
//div/parent::*

/* Following sibling */
//h1/following-sibling::p

/* Preceding sibling */
//p/preceding-sibling::h1
```

### Functions

```xpath
/* Contains text */
//p[contains(text(), "hello")]

/* Contains class */
//*[contains(@class, "product")]

/* Starts with */
//a[starts-with(@href, "https")]

/* String length */
//p[string-length(text()) > 50]
```

### Logical Operators

```xpath
/* AND condition */
//div[@class="product" and @data-available="true"]

/* OR condition */
//div[@class="product" or @class="item"]

/* NOT condition */
//div[not(@hidden)]
```

## Selector Examples

### E-commerce Products

```css
/* Product container */
.product-card

/* Product title */
.product-card h2 a

/* Product price */
.product-card .price

/* Product image */
.product-card img

/* Product rating */
.product-card .rating span

/* Add to cart button */
.product-card button.add-to-cart
```

### Blog Articles

```css
/* Article container */
article.post

/* Article title */
article.post h1.title

/* Article content */
article.post .content

/* Article date */
article.post time

/* Author name */
article.post .author

/* Tags */
article.post .tags a
```

### News Websites

```css
/* News headline */
.headline h3 a

/* News summary */
.news-item p.summary

/* News timestamp */
.news-item span.timestamp

/* Category label */
.news-item .category

/* Related articles */
.related-articles li a
```

### Tables

```css
/* Table rows */
table.data tr

/* Table headers */
table.data th

/* Table cells */
table.data td

/* Specific column */
table.data td:nth-child(2)

/* Row with class */
table.data tr.even
```

### Forms

```css
/* Input fields */
form input[type="text"]

/* Submit button */
form button[type="submit"]

/* Required fields */
form input[required]

/* Error messages */
form .error-message

/* Success message */
form .success
```

## Best Practices

### ✅ Recommended

1. **Use CSS Selectors When Possible**
   - Faster than XPath
   - Easier to read and write
   - Supported by all browsers

2. **Be Specific But Flexible**
   ```css
   /* Good: Specific but not too rigid */
   .product-list .product-item h3
   
   /* Too rigid: Breaks easily */
   div > div:nth-child(2) > ul > li:nth-child(3) > h3
   ```

3. **Use Classes Over Structure**
   ```css
   /* Better: Class-based */
   .product-title
   
   /* Fragile: Structure-based */
   div:nth-child(2) > span
   ```

4. **Test Selectors First**
   - Use browser DevTools
   - Test in ScrapeBI preview
   - Verify on multiple pages

### ❌ Avoid

1. **Absolute XPaths**
   ```xpath
   /* Bad: Breaks with any change */
   /html/body/div[1]/div[3]/div[2]/span
   
   /* Good: Flexible */
   //div[@class="product"]//h3
   ```

2. **Overly Complex Selectors**
   ```css
   /* Too complex */
   div > ul:nth-child(3) > li:first-child + li + li
   
   /* Simpler alternative */
   .product-list li:nth-child(3)
   ```

3. **Dynamic IDs**
   ```css
   /* Bad: Changes on each load */
   #product-12345
   
   /* Better: Stable class */
   .product-item
   ```

## Testing Selectors

### In Browser DevTools

1. Open DevTools (F12)
2. Go to Console tab
3. Test CSS selector:
   ```javascript
   document.querySelectorAll('.product')
   ```
4. Test XPath:
   ```javascript
   document.evaluate('//div[@class="product"]', document, null, XPathResult.ANY_TYPE, null)
   ```

### In ScrapeBI

1. Scrape a website
2. Go to Element List tab
3. Click an element to see its selector
4. Use in extraction rule

## Common Patterns

### Get All Links

```css
/* All links */
a

/* Links in specific section */
.content a

/* External links */
a[href^="http"]

/* Internal links */
a[href^="/"]
```

### Get All Images

```css
/* All images */
img

/* Images with alt text */
img[alt]

/* Images in articles */
article img

/* Background images (need XPath) */
//*[contains(@style, "background-image")]
```

### Get Text Content

```css
/* Paragraphs */
p

/* Headings */
h1, h2, h3, h4, h5, h6

/* Spans with class */
span.highlight

/* List items */
ul li
```

## Troubleshooting

### Selector Not Working

1. **Check spelling** - Class names are case-sensitive
2. **Verify element exists** - Use browser DevTools
3. **Try simpler selector** - Start basic, add specificity
4. **Check for iframes** - Content might be in iframe

### Multiple Elements Selected

1. **Be more specific** - Add parent selectors
2. **Use classes** - More specific than tags
3. **Add attributes** - Narrow down with attributes

### Dynamic Content

1. **Increase wait time** - Let JavaScript load
2. **Use Visual Selector** - See rendered elements
3. **Check for AJAX** - May need longer wait

---

**Need more help?** Check [Examples](examples.md) or [Troubleshooting](troubleshooting.md).
