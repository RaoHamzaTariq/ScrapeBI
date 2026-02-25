# API Reference

Complete API documentation for programmatic access to ScrapeBI functionality.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Scrape Endpoint](#scrape-endpoint)
- [Elements Endpoint](#elements-endpoint)
- [Extract Endpoint](#extract-endpoint)
- [Rules Endpoints](#rules-endpoints)
- [Export Endpoint](#export-endpoint)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

## Overview

ScrapeBI provides a RESTful API for programmatic access to all scraping functionality. Use the API to integrate ScrapeBI into your applications, automate workflows, or build custom tools.

### Base URL

```
http://localhost:5000/api
```

### Request Format

All API requests use:
- **Content-Type:** `application/json`
- **Method:** POST or GET (as specified)
- **Body:** JSON object

### Response Format

All API responses return JSON:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## Authentication

### Current Version

The current version of ScrapeBI runs locally and doesn't require authentication.

### Future Versions

Future versions may include:
- API key authentication
- Token-based auth
- Rate limiting

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scrape` | POST | Scrape a website URL |
| `/get_elements` | POST | Get detected elements |
| `/extract` | POST | Extract data using rules |
| `/save_rule` | POST | Save extraction rule |
| `/get_rules` | GET | Get all saved rules |
| `/delete_rule/<id>` | DELETE | Delete a rule |
| `/export` | POST | Export extracted data |
| `/preview_html` | POST | Get preview HTML |
| `/batch_extract` | POST | Run multiple rules |

## Scrape Endpoint

### POST /api/scrape

Scrape a website and store the HTML for further processing.

**Request:**
```json
{
  "url": "https://example.com",
  "wait_time": 3
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "abc123-def456",
  "title": "Example Domain",
  "html_length": 1234,
  "preview": "<!DOCTYPE html>..."
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| url | string | Yes | - | Website URL to scrape |
| wait_time | integer | No | 3 | Seconds to wait for page load |

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

## Elements Endpoint

### POST /api/get_elements

Get all detected elements from a scraped page.

**Request:**
```json
{
  "session_id": "abc123-def456"
}
```

**Response:**
```json
{
  "success": true,
  "elements": {
    "headings": [
      {
        "index": 0,
        "tag": "h1",
        "text": "Welcome",
        "selector": "h1",
        "id": "",
        "class": "title"
      }
    ],
    "links": [...],
    "images": [...],
    "paragraphs": [...],
    "tables": [...],
    "lists": [...],
    "forms": [...],
    "buttons": [...],
    "inputs": [...]
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| session_id | string | Yes | Session ID from scrape response |

**Element Categories:**

| Category | Fields |
|----------|--------|
| headings | index, tag, text, selector, id, class |
| links | index, text, href, selector, id, class |
| images | index, src, alt, selector, id, class |
| paragraphs | index, text, selector, id, class |
| tables | index, rows, selector, id, class |
| lists | index, tag, items, selector, id, class |
| forms | index, action, selector, id, class |
| buttons | index, text, selector, id, class |
| inputs | index, type, name, placeholder, selector |

## Extract Endpoint

### POST /api/extract

Extract data using an extraction rule.

**Request:**
```json
{
  "session_id": "abc123-def456",
  "rule": {
    "selector_type": "css",
    "selector": "h1",
    "attribute": "text"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    "Welcome to Example",
    "Main Heading"
  ],
  "count": 2
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| session_id | string | Yes | Session ID from scrape |
| rule | object | Yes | Extraction rule |
| rule.selector_type | string | Yes | css, xpath, tag, class, id |
| rule.selector | string | Yes | Selector pattern |
| rule.attribute | string | Yes | text, html, href, src, etc. |

**Selector Types:**

| Type | Description | Example |
|------|-------------|---------|
| css | CSS selector | `.product-title` |
| xpath | XPath expression | `//h1` |
| tag | HTML tag name | `h1` |
| class | Class name | `product-title` |
| id | Element ID | `main-header` |

**Extract Attributes:**

| Attribute | Returns |
|-----------|---------|
| text | Text content |
| html | HTML content |
| href | Link URL |
| src | Image source |
| alt | Alt text |
| title | Title attribute |
| id | Element ID |
| class | Class attribute |
| all | All element data |

## Rules Endpoints

### POST /api/save_rule

Save an extraction rule for later use.

**Request:**
```json
{
  "name": "Product Titles",
  "selector_type": "css",
  "selector": ".product-title",
  "attribute": "text"
}
```

**Response:**
```json
{
  "success": true,
  "rule_id": "rule-123-abc"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Rule name |
| selector_type | string | Yes | Type of selector |
| selector | string | Yes | Selector pattern |
| attribute | string | Yes | What to extract |

### GET /api/get_rules

Get all saved extraction rules.

**Request:**
```
GET /api/get_rules
```

**Response:**
```json
{
  "success": true,
  "rules": [
    {
      "id": "rule-123-abc",
      "name": "Product Titles",
      "selector_type": "css",
      "selector": ".product-title",
      "attribute": "text",
      "created_at": "2026-02-25T10:30:00"
    }
  ]
}
```

### DELETE /api/delete_rule/<rule_id>

Delete a saved extraction rule.

**Request:**
```
DELETE /api/delete_rule/rule-123-abc
```

**Response:**
```json
{
  "success": true
}
```

## Export Endpoint

### POST /api/export

Export extracted data to file.

**Request:**
```json
{
  "format": "json",
  "data": [
    {
      "rule": "Product Titles",
      "index": 1,
      "value": "Product A"
    }
  ]
}
```

**Response:**
- File download (not JSON)

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | Yes | json, csv, or txt |
| data | array | Yes | Extracted data to export |

**Export Formats:**

| Format | Content-Type | Use Case |
|--------|--------------|----------|
| json | application/json | APIs, programming |
| csv | text/csv | Spreadsheets, analysis |
| txt | text/plain | Simple lists |

## Error Handling

### Error Response Format

All errors return:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Session not found` | Invalid session_id | Re-scrape the URL |
| `No data to export` | Empty data array | Run extraction first |
| `Unsupported format` | Invalid export format | Use json, csv, or txt |
| `Invalid URL` | Malformed URL | Add http:// or https:// |
| `Page load timeout` | Site too slow | Increase wait_time |
| `Rule not found` | Invalid rule_id | Check rule ID |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 404 | Not Found (session/rule doesn't exist) |
| 500 | Server Error |

## Code Examples

### Python Example

```python
import requests

BASE_URL = 'http://localhost:5000/api'

# Step 1: Scrape a website
scrape_response = requests.post(f'{BASE_URL}/scrape', json={
    'url': 'https://books.toscrape.com/',
    'wait_time': 3
})

data = scrape_response.json()
session_id = data['session_id']

# Step 2: Extract data
extract_response = requests.post(f'{BASE_URL}/extract', json={
    'session_id': session_id,
    'rule': {
        'selector_type': 'css',
        'selector': 'h3 a',
        'attribute': 'text'
    }
})

results = extract_response.json()
print(f"Found {results['count']} book titles:")
for title in results['results']:
    print(f"  - {title}")

# Step 3: Save rule for later
save_response = requests.post(f'{BASE_URL}/save_rule', json={
    'name': 'Book Titles',
    'selector_type': 'css',
    'selector': 'h3 a',
    'attribute': 'text'
})

rule_id = save_response.json()['rule_id']
print(f"Rule saved with ID: {rule_id}")
```

### JavaScript Example

```javascript
const BASE_URL = 'http://localhost:5000/api';

// Scrape a website
async function scrapeWebsite(url, waitTime = 3) {
  const response = await fetch(`${BASE_URL}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, wait_time: waitTime })
  });
  return await response.json();
}

// Extract data
async function extractData(sessionId, rule) {
  const response = await fetch(`${BASE_URL}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, rule })
  });
  return await response.json();
}

// Usage
async function main() {
  // Scrape
  const scrapeResult = await scrapeWebsite('https://books.toscrape.com/');
  const sessionId = scrapeResult.session_id;
  
  // Extract
  const extractResult = await extractData(sessionId, {
    selector_type: 'css',
    selector: 'h3 a',
    attribute: 'text'
  });
  
  console.log(`Found ${extractResult.count} titles`);
  extractResult.results.forEach(title => console.log(`  - ${title}`));
}

main();
```

### Node.js Example

```javascript
const axios = require('axios');

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

async function scrapeAndExtract(url) {
  try {
    // Scrape
    const scrapeRes = await API.post('/scrape', {
      url: url,
      wait_time: 3
    });
    
    const sessionId = scrapeRes.data.session_id;
    
    // Extract
    const extractRes = await API.post('/extract', {
      session_id: sessionId,
      rule: {
        selector_type: 'css',
        selector: '.product-title',
        attribute: 'text'
      }
    });
    
    return extractRes.data;
    
  } catch (error) {
    console.error('Error:', error.response.data.error);
    throw error;
  }
}

// Usage
scrapeAndExtract('https://example.com')
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

### cURL Example

```bash
# Scrape a website
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "wait_time": 3}'

# Extract data
curl -X POST http://localhost:5000/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "SESSION_ID",
    "rule": {
      "selector_type": "css",
      "selector": "h1",
      "attribute": "text"
    }
  }'

# Save a rule
curl -X POST http://localhost:5000/api/save_rule \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Page Titles",
    "selector_type": "css",
    "selector": "h1",
    "attribute": "text"
  }'

# Get all rules
curl -X GET http://localhost:5000/api/get_rules

# Delete a rule
curl -X DELETE http://localhost:5000/api/delete_rule/RULE_ID
```

## Rate Limiting

### Current Version

No rate limiting in local version.

### Future Versions

May include:
- Requests per minute
- Requests per hour
- Concurrent request limits

## Session Management

### Session Lifecycle

```
1. Create Session → POST /api/scrape
   ↓
2. Use Session → Multiple API calls
   ↓
3. Session Expires → After timeout or server restart
```

### Session Duration

- Sessions stored in memory
- Persist during server runtime
- Lost on server restart
- No explicit session deletion

### Best Practices

```
✅ Use session_id immediately after scrape
✅ Complete all operations in one session
✅ Re-scrape if session expired
❌ Don't store session_ids long-term
❌ Don't share session_ids between users
```

---

**Next:** Review [Configuration](configuration.md) options for customizing ScrapeBI.
