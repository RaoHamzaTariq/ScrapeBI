# Architecture Overview

Understanding ScrapeBI's system design and architecture.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Details](#component-details)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Design Decisions](#design-decisions)
- [Security Architecture](#security-architecture)
- [Scalability](#scalability)

---

## System Overview

ScrapeBI is a web-based application that provides a visual interface for web scraping without requiring code. It combines browser automation with an intuitive UI to make data extraction accessible to everyone.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Type** | Web Application |
| **Architecture** | Client-Server |
| **Deployment** | Local/Single-server |
| **Data Storage** | In-memory (session-based) |
| **Browser** | Chrome via Selenium |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Browser (Chrome/Chromium)                              │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  ScrapeBI Web Interface (HTML/CSS/JS)           │   │   │
│  │  │  • Visual Selector                              │   │   │
│  │  │  • Element List                                 │   │   │
│  │  │  • Rules Manager                                │   │   │
│  │  │  • Results Viewer                               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Flask Web Server                                       │   │
│  │  • Routing                                              │   │
│  │  • Request/Response Handling                            │   │
│  │  • Session Management                                   │   │
│  │  • API Endpoints                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                                   │   │
│  │  • Scraping Service                                     │   │
│  │  • Element Detection                                    │   │
│  │  • Rule Engine                                          │   │
│  │  • Export Handlers                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Automation Layer                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Selenium WebDriver                                     │   │
│  │  • Chrome Driver                                        │   │
│  │  • Browser Control                                      │   │
│  │  • JavaScript Execution                                 │   │
│  │  • Page Rendering                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Data Processing                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BeautifulSoup                                          │   │
│  │  • HTML Parsing                                         │   │
│  │  • Element Selection                                    │   │
│  │  • Data Extraction                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Pandas                                                 │   │
│  │  • Data Transformation                                  │   │
│  │  • CSV Export                                           │   │
│  │  • Data Analysis                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Frontend Components

#### 1. Visual Selector
**Purpose:** Interactive element selection

**Technologies:**
- HTML5 iframe
- JavaScript event handlers
- CSS highlighting

**Key Functions:**
```javascript
- loadPreview()      // Load page in iframe
- highlightElement() // Highlight on hover
- selectElement()    // Select on click
- postMessage()      // Send to parent
```

#### 2. Element List
**Purpose:** Categorized element browsing

**Categories:**
- Headings (H1-H6)
- Links
- Images
- Paragraphs
- Tables
- Lists
- Forms
- Buttons
- Inputs

#### 3. Rules Manager
**Purpose:** Create and manage extraction rules

**Features:**
- Rule creation modal
- Selector type selection
- Attribute selection
- Rule validation

#### 4. Results Viewer
**Purpose:** Display and export results

**Capabilities:**
- Results organized by rule
- Export to JSON/CSV/TXT
- Result count display

### Backend Components

#### 1. Flask Application (`app.py`)

**Structure:**
```python
ScrapeBI/
├── Flask App
│   ├── Routes
│   │   ├── / (index)
│   │   ├── /api/scrape
│   │   ├── /api/get_elements
│   │   ├── /api/extract
│   │   ├── /api/save_rule
│   │   ├── /api/get_rules
│   │   ├── /api/delete_rule/<id>
│   │   ├── /api/export
│   │   └── /api/preview_html
│   │
│   ├── Models
│   │   ├── scraped_data_store
│   │   └── extraction_rules_store
│   │
│   └── Services
│       └── SeleniumScraper
```

**Key Routes:**

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Main UI |
| `/api/scrape` | POST | Scrape URL |
| `/api/get_elements` | POST | Get elements |
| `/api/extract` | POST | Extract data |
| `/api/save_rule` | POST | Save rule |
| `/api/get_rules` | GET | Get rules |
| `/api/export` | POST | Export data |

#### 2. SeleniumScraper Class

**Responsibilities:**
- Browser initialization
- Page scraping
- Element detection
- Data extraction

**Key Methods:**
```python
class SeleniumScraper:
    def init_driver()       # Initialize Chrome
    def scrape_url()        # Scrape webpage
    def get_element_info()  # Get element details
    def extract_by_rule()   # Extract using rule
    def close()             # Close browser
```

#### 3. Data Stores

**In-Memory Storage:**
```python
# Scraped content
scraped_data_store = {
    'session_id': {
        'url': '...',
        'html': '...',
        'timestamp': '...'
    }
}

# Extraction rules
extraction_rules_store = {
    'rule_id': {
        'name': '...',
        'selector_type': 'css',
        'selector': '...',
        'attribute': 'text'
    }
}
```

---

## Data Flow

### Scraping Flow

```
User enters URL
      ↓
Frontend sends POST /api/scrape
      ↓
Flask route handler
      ↓
SeleniumScraper.scrape_url()
      ↓
Chrome loads page (with wait time)
      ↓
HTML captured
      ↓
BeautifulSoup parses HTML
      ↓
Session created and stored
      ↓
Response with session_id
      ↓
Frontend updates UI
```

### Element Detection Flow

```
User switches to Element List tab
      ↓
Frontend sends POST /api/get_elements
      ↓
Flask retrieves HTML from session
      ↓
BeautifulSoup finds elements by category
      ↓
Elements organized into categories
      ↓
Response with categorized elements
      ↓
Frontend renders element cards
```

### Extraction Flow

```
User creates extraction rule
      ↓
Frontend sends POST /api/save_rule
      ↓
Rule stored in extraction_rules_store
      ↓
User clicks "Run All Rules"
      ↓
Frontend sends POST /api/batch_extract
      ↓
For each rule:
  - SeleniumScraper.extract_by_rule()
  - BeautifulSoup selects elements
  - Extracts specified attribute
      ↓
Results collected
      ↓
Response with results
      ↓
Frontend displays in Results tab
```

### Export Flow

```
User clicks export button (JSON/CSV/TXT)
      ↓
Frontend sends POST /api/export
      ↓
Flask formats data based on format
      ↓
For JSON: json.dump()
For CSV: pandas.DataFrame.to_csv()
For TXT: Text formatting
      ↓
File saved to temp directory
      ↓
File sent as download
      ↓
Browser downloads file
```

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Runtime |
| Flask | 2.3.3 | Web framework |
| Selenium | 4.15.2 | Browser automation |
| BeautifulSoup4 | 4.12.2 | HTML parsing |
| lxml | 4.9.3 | XML/HTML parser |
| Pandas | 2.2.0 | Data handling |
| webdriver-manager | 4.0.1 | ChromeDriver management |
| requests | 2.31.0 | HTTP library |

### Frontend

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript (Vanilla) | Interactivity |
| TailwindCSS (CDN) | Utility classes |
| Font Awesome | Icons |
| Google Fonts | Typography |

### Browser

| Component | Purpose |
|-----------|---------|
| Google Chrome | Browser engine |
| ChromeDriver | WebDriver |
| Selenium | Automation |

---

## Design Decisions

### Why Flask?

**Pros:**
- Lightweight and fast
- Easy to set up
- Python ecosystem
- Good for prototyping
- Simple deployment

**Alternatives Considered:**
- Django (too heavy)
- FastAPI (overkill for this use case)
- Bottle (less mature)

### Why Selenium?

**Pros:**
- Full JavaScript support
- Real browser rendering
- Handles dynamic content
- Well-documented
- Cross-platform

**Alternatives Considered:**
- Requests + BeautifulSoup (no JS)
- Playwright (newer, less mature)
- Puppeteer (Node.js only)

### Why In-Memory Storage?

**Pros:**
- Fast access
- No database setup
- Simple implementation
- Session isolation

**Cons:**
- Data lost on restart
- Not scalable
- Limited by RAM

**Future:** Database support planned

### Why Chrome?

**Pros:**
- Most popular browser
- Best JavaScript support
- Regular updates
- Good DevTools
- webdriver-manager support

**Alternatives:**
- Firefox (less popular)
- Edge (Chromium-based)
- Safari (limited automation)

---

## Security Architecture

### Current Security Measures

| Measure | Implementation |
|---------|----------------|
| Input Validation | URL validation |
| Session Isolation | UUID-based sessions |
| CORS | Localhost only |
| Error Handling | Try-catch blocks |

### Security Considerations

**Input Sanitization:**
```python
# URL validation
if not url.startswith(('http://', 'https://')):
    url = 'https://' + url
```

**Session Security:**
```python
# UUID for session IDs
session_id = str(uuid.uuid4())
```

**Error Handling:**
```python
try:
    # Operation
except Exception as e:
    return jsonify({'success': False, 'error': str(e)})
```

### Future Security Enhancements

- API key authentication
- Rate limiting
- Request signing
- Encrypted storage
- HTTPS support

---

## Scalability

### Current Limitations

| Limitation | Impact |
|------------|--------|
| In-memory storage | Limited by RAM |
| Single-threaded | One scrape at a time |
| Local deployment | No distributed scraping |
| No queue | No job management |

### Scaling Strategies

#### Horizontal Scaling

```
Load Balancer
    ↓
[ScrapeBI Instance 1]
[ScrapeBI Instance 2]
[ScrapeBI Instance 3]
    ↓
Shared Session Store (Redis)
```

#### Vertical Scaling

```
Increase:
- RAM for more sessions
- CPU for faster processing
- Bandwidth for more requests
```

#### Future Architecture

```
┌─────────────────────────────────────────┐
│              API Gateway                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│           Task Queue (Redis)            │
└─────────────────────────────────────────┘
              ↓
┌───────┬───────┬───────┬───────┐
│Worker 1│Worker 2│Worker 3│Worker 4│
└───────┴───────┴───────┴───────┘
              ↓
┌─────────────────────────────────────────┐
│        Database (PostgreSQL)            │
└─────────────────────────────────────────┘
```

---

## File Structure

```
ScrapeBI/
├── app.py                 # Flask application
├── run.py                 # Entry point
├── requirements.txt       # Dependencies
├── README.md              # Documentation
├── .gitignore             # Git ignore
│
├── templates/
│   └── index.html         # Main UI
│
├── static/
│   ├── css/
│   │   └── style.css      # Custom styles
│   ├── js/
│   │   └── app.js         # Frontend JS
│   └── logo.png           # Logo
│
├── public/
│   ├── logo.png           # Public logo
│   └── preview.png        # Preview image
│
└── docs/
    ├── README.md          # Docs index
    ├── installation.md
    ├── quickstart.md
    └── ...                # Other docs
```

---

## Performance Considerations

### Bottlenecks

1. **Browser Launch** - Chrome takes time to start
2. **Page Load** - Network dependent
3. **JavaScript Execution** - CPU intensive
4. **HTML Parsing** - Memory intensive

### Optimizations

**Implemented:**
- Session reuse
- Efficient selectors
- Minimal DOM manipulation

**Future:**
- Browser pooling
- Request caching
- Parallel scraping
- CDN for static assets

---

**Next:** Review [API Reference](api-reference.md) for detailed API documentation.
