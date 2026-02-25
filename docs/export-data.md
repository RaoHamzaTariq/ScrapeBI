# Export Data Guide

Export your scraped data in multiple formats for analysis, reporting, and integration.

## Table of Contents

- [Export Overview](#export-overview)
- [JSON Export](#json-export)
- [CSV Export](#csv-export)
- [TXT Export](#txt-export)
- [Format Comparison](#format-comparison)
- [Export Best Practices](#export-best-practices)
- [Data Integration](#data-integration)

## Export Overview

### Available Formats

| Format | Best For | File Extension |
|--------|----------|----------------|
| JSON | Developers, APIs, structured data | `.json` |
| CSV | Spreadsheets, data analysis | `.csv` |
| TXT | Simple lists, quick reference | `.txt` |

### How to Export

1. **Run Extraction Rules**
   - Execute rules to generate results
   - Results appear in Results tab

2. **Choose Format**
   - Click JSON, CSV, or TXT button
   - File downloads automatically

3. **Open File**
   - JSON: Text editor, code editor
   - CSV: Excel, Google Sheets
   - TXT: Any text editor

### Export Location

Files download to your browser's default download folder:
- **Windows:** `C:\Users\[Username]\Downloads`
- **macOS:** `/Users/[Username]/Downloads`
- **Linux:** `/home/[Username]/Downloads`

## JSON Export

### What is JSON?

JSON (JavaScript Object Notation) is a structured data format that's easy for computers to parse and generate.

### When to Use JSON

✅ **Best for:**
- API integrations
- Programming projects
- Nested/structured data
- Data interchange between systems
- Preserving data hierarchy

❌ **Not ideal for:**
- Non-technical users
- Direct spreadsheet use
- Simple flat data

### JSON Structure

**ScrapeBI JSON Output:**
```json
{
  "Book Titles": [
    "A Light in the Attic",
    "Tipping the Velvet",
    "Soumission",
    "The Black Maria"
  ],
  "Book Prices": [
    "£51.77",
    "£53.74",
    "£50.10",
    "£49.28"
  ],
  "Star Ratings": [
    "Three",
    "Two",
    "One",
    "Three"
  ]
}
```

### Using JSON Data

#### In JavaScript
```javascript
fetch('scraped_data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data['Book Titles']);
    // ["A Light in the Attic", "Tipping the Velvet", ...]
  });
```

#### In Python
```python
import json

with open('scraped_data.json', 'r') as f:
    data = json.load(f)

print(data['Book Titles'])
# ['A Light in the Attic', 'Tipping the Velvet', ...]
```

#### In Node.js
```javascript
const data = require('./scraped_data.json');
console.log(data['Book Prices']);
```

### JSON Tools

| Tool | Purpose |
|------|---------|
| JSONLint | Validate JSON |
| JSON Formatter | Pretty print |
| VS Code | Edit with syntax highlighting |
| Postman | Test with APIs |

## CSV Export

### What is CSV?

CSV (Comma-Separated Values) is a plain text format that stores tabular data, compatible with spreadsheet applications.

### When to Use CSV

✅ **Best for:**
- Excel/Google Sheets analysis
- Data visualization
- Database imports
- Sharing with non-technical users
- Flat data structures

❌ **Not ideal for:**
- Nested/hierarchical data
- Complex data types
- Preserving data types

### CSV Structure

**ScrapeBI CSV Output:**
```csv
rule,index,value
Book Titles,1,A Light in the Attic
Book Titles,2,Tipping the Velvet
Book Titles,3,Soumission
Book Prices,1,£51.77
Book Prices,2,£53.74
Book Prices,3,£50.10
Star Ratings,1,Three
Star Ratings,2,Two
Star Ratings,3,One
```

### Opening CSV Files

#### Microsoft Excel
1. Open Excel
2. File → Open → Select CSV
3. Data appears in spreadsheet
4. Can filter, sort, analyze

#### Google Sheets
1. Open Google Sheets
2. File → Import → Upload
3. Select CSV file
4. Choose import settings
5. Data appears in sheet

#### LibreOffice Calc
1. Open Calc
2. File → Open → Select CSV
3. Text Import dialog appears
4. Configure delimiter (comma)
5. Data imports

### CSV Analysis Examples

#### Excel/Sheets Formulas
```
=COUNTIF(A:A, "Book Titles")     Count by rule
=AVERAGEIF(A:A, "Book Prices", C:C)  Average prices
=FILTER(A:C, A:A="Book Titles")  Filter by rule
```

#### Pivot Tables
- Rows: rule
- Values: count of value
- Analyze data distribution

### CSV Tools

| Tool | Purpose |
|------|---------|
| Excel | Spreadsheet analysis |
| Google Sheets | Online collaboration |
| CSVLint | Validate CSV |
| DB Browser for SQLite | Import to database |

## TXT Export

### What is TXT?

Plain text format with simple organization, human-readable without special software.

### When to Use TXT

✅ **Best for:**
- Simple lists
- Quick reference
- Copy-paste operations
- Command-line processing
- Minimal file size

❌ **Not ideal for:**
- Structured data
- Analysis
- Programming use
- Complex data

### TXT Structure

**ScrapeBI TXT Output:**
```
=== Book Titles ===
--------------------------------------------------
1. A Light in the Attic
2. Tipping the Velvet
3. Soumission
4. The Black Maria

=== Book Prices ===
--------------------------------------------------
1. £51.77
2. £53.74
3. £50.10
4. £49.28

=== Star Ratings ===
--------------------------------------------------
1. Three
2. Two
3. One
4. Three
```

### Using TXT Files

#### View in Any Text Editor
- Notepad (Windows)
- TextEdit (macOS)
- Gedit (Linux)
- VS Code, Sublime, Atom

#### Command Line Processing
```bash
# Count lines
wc -l scraped_data.txt

# Search for text
grep "Book Titles" scraped_data.txt

# Extract specific lines
sed -n '5,10p' scraped_data.txt
```

#### Copy-Paste
- Easy to copy sections
- Paste into documents
- Share in chat/email

## Format Comparison

### Feature Comparison

| Feature | JSON | CSV | TXT |
|---------|------|-----|-----|
| Structure | Hierarchical | Tabular | Linear |
| Human Readable | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Machine Readable | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| File Size | Medium | Small | Smallest |
| Spreadsheet Ready | ❌ | ✅ | ❌ |
| API Ready | ✅ | ❌ | ❌ |
| Programming Use | ✅ | ⚠️ | ❌ |
| Quick Reference | ❌ | ⚠️ | ✅ |

### Use Case Matrix

| Use Case | Recommended Format |
|----------|-------------------|
| API Integration | JSON |
| Data Analysis | CSV |
| Spreadsheet Work | CSV |
| Quick Reference | TXT |
| Database Import | CSV |
| Programming | JSON |
| Documentation | TXT |
| Data Exchange | JSON |

## Export Best Practices

### ✅ Do's

#### 1. Choose Right Format
```
Analysis → CSV
Development → JSON
Reference → TXT
```

#### 2. Export Regularly
- Session data is temporary
- Export before closing browser
- Keep backups of important data

#### 3. Name Files Descriptively
```
✅ scraped_books_2026-02-25.json
✅ amazon_prices_feb25.csv
❌ data.json
❌ export1.csv
```

#### 4. Verify Export
- Open file after download
- Check data completeness
- Verify formatting

### ❌ Don'ts

- Don't leave data unexported
- Don't use wrong format for use case
- Don't skip verification
- Don't overwrite important files

## Data Integration

### Import to Excel

**Steps:**
1. Export as CSV
2. Open Excel
3. File → Open → Select CSV
4. Data appears in cells
5. Format as needed

### Import to Google Sheets

**Steps:**
1. Export as CSV
2. Open Google Sheets
3. File → Import → Upload
4. Select CSV
5. Choose "Detect automatically"
6. Import data

### Import to Database

**SQLite Example:**
```sql
-- Create table
CREATE TABLE products (
    rule TEXT,
    index INTEGER,
    value TEXT
);

-- Import CSV
.mode csv
.import scraped_data.csv products
```

**MySQL Example:**
```sql
LOAD DATA INFILE 'scraped_data.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

### Use in Python

```python
import json
import csv
import pandas as pd

# Load JSON
with open('data.json') as f:
    data = json.load(f)

# Load CSV
df = pd.read_csv('data.csv')

# Process data
titles = data['Book Titles']
prices = df[df['rule'] == 'Book Prices']['value']
```

### Use in JavaScript

```javascript
// Fetch JSON
fetch('data.json')
  .then(r => r.json())
  .then(data => console.log(data));

// Fetch CSV (with PapaParse)
Papa.parse('data.csv', {
  download: true,
  header: true,
  complete: (results) => console.log(results.data)
});
```

## Troubleshooting

### Export Button Not Working

**Causes:**
- No results to export
- Browser popup blocker
- Download permission issue

**Solutions:**
1. Run extraction rules first
2. Allow popups for localhost
3. Check browser download settings
4. Try different browser

### CSV Opens Wrong

**Problem:** Opens in wrong application

**Solutions:**
1. Right-click → Open With → Choose app
2. Set default app for .csv files
3. Import manually in Excel/Sheets

### JSON Formatting Issues

**Problem:** All on one line

**Solutions:**
1. Use JSON formatter tool
2. Open in code editor
3. Use prettify function

### Special Characters Wrong

**Problem:** Encoding issues

**Solutions:**
1. Open with UTF-8 encoding
2. In Excel: Data → From Text → UTF-8
3. Use proper encoding in code

### Missing Data in Export

**Problem:** Not all data exported

**Solutions:**
1. Re-run extraction rules
2. Check results before export
3. Export again
4. Verify rule execution

---

**Next:** Learn about [Advanced Selectors](advanced-selectors.md) for precise targeting.
