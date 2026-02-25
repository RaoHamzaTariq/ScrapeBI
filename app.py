"""
ScrapeBI - No-Code Web Scraping Tool
A complete web scraping solution with visual element selector
"""

from flask import Flask, render_template, request, jsonify, send_file
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import os
import re
import time
import uuid
import tempfile
from datetime import datetime
from urllib.parse import urlparse
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'scrapebi-secret-key'

# Global storage for scraped data
scraped_data_store = {}
extraction_rules_store = {}

class SeleniumScraper:
    """Selenium-based web scraper with advanced capabilities"""

    def __init__(self, headless=False):
        self.driver = None
        self.headless = headless
        self.html_content = ""
        self.soup = None
        self.last_used = None

    def init_driver(self):
        """Initialize Chrome WebDriver"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)

        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.last_used = time.time()
            print("WebDriver initialized successfully")
            return True
        except Exception as e:
            print(f"Error initializing driver: {e}")
            return False
    
    def scrape_url(self, url, wait_time=3):
        """Scrape a URL and return HTML content"""
        try:
            # Check if driver exists and is valid
            if not self.driver:
                if not self.init_driver():
                    return None, "Failed to initialize WebDriver"
            
            # Try to use existing driver, reinitialize if session is invalid
            try:
                # Test if driver is still responsive
                self.driver.current_url
            except Exception as driver_error:
                print(f"Driver session invalid, reinitializing: {driver_error}")
                try:
                    self.driver.quit()
                except:
                    pass
                self.driver = None
                if not self.init_driver():
                    return None, "Failed to reinitialize WebDriver"
            
            self.driver.get(url)
            time.sleep(wait_time)  # Wait for page to load

            # Wait for body to be present
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            self.html_content = self.driver.page_source
            self.soup = BeautifulSoup(self.html_content, 'html.parser')
            self.last_used = time.time()

            return self.html_content, None
        except TimeoutException:
            return None, "Page load timeout"
        except Exception as e:
            error_msg = str(e)
            # If it's a session error, try to reinitialize
            if 'invalid session id' in error_msg.lower() or 'session not created' in error_msg.lower():
                print(f"Session error, trying to reinitialize driver")
                try:
                    self.driver.quit()
                except:
                    pass
                self.driver = None
                if self.init_driver():
                    # Retry the request
                    return self.scrape_url(url, wait_time)
            return None, error_msg
    
    def get_element_info(self, element):
        """Get detailed information about an element"""
        info = {
            'tag': element.name,
            'text': element.get_text(strip=True)[:200] if element.get_text(strip=True) else '',
            'attributes': {},
            'css_selector': self._get_css_selector(element),
            'xpath': self._get_xpath(element)
        }
        
        # Get important attributes
        for attr in ['id', 'class', 'name', 'href', 'src', 'alt', 'title', 'data-*']:
            if attr == 'class':
                classes = element.get('class', [])
                if classes:
                    info['attributes']['class'] = ' '.join(classes)
            elif attr == 'data-*':
                for key in element.attrs:
                    if key.startswith('data-'):
                        info['attributes'][key] = element[key]
            elif element.get(attr):
                info['attributes'][attr] = element[attr]
        
        return info
    
    def _get_css_selector(self, element):
        """Generate CSS selector for element"""
        selector = element.name
        if element.get('id'):
            selector += f"#{element['id']}"
        elif element.get('class'):
            classes = '.'.join(element.get('class', []))
            selector += f".{classes}"
        return selector
    
    def _get_xpath(self, element):
        """Generate XPath for element"""
        parts = []
        current = element
        while current and current.name != '[document]':
            index = 1
            for sibling in current.previous_siblings:
                if sibling.name == current.name:
                    index += 1
            parts.insert(0, f"{current.name}[{index}]")
            current = current.parent
        return '/' + '/'.join(parts)
    
    def extract_by_rule(self, rule):
        """Extract data based on extraction rule"""
        if not self.soup:
            return []
        
        results = []
        selector_type = rule.get('selector_type', 'css')
        selector = rule.get('selector', '')
        attribute = rule.get('attribute', 'text')
        
        try:
            if selector_type == 'css':
                elements = self.soup.select(selector)
            elif selector_type == 'xpath':
                # For XPath, we'd need lxml, fallback to CSS
                elements = self.soup.select(selector)
            elif selector_type == 'tag':
                elements = self.soup.find_all(selector)
            elif selector_type == 'class':
                elements = self.soup.find_all(class_=selector)
            elif selector_type == 'id':
                element = self.soup.find(id=selector)
                elements = [element] if element else []
            else:
                elements = []
            
            for elem in elements:
                if elem:
                    if attribute == 'text':
                        results.append(elem.get_text(strip=True))
                    elif attribute == 'html':
                        results.append(str(elem))
                    elif attribute == 'all':
                        results.append(self.get_element_info(elem))
                    else:
                        results.append(elem.get(attribute, ''))
        except Exception as e:
            print(f"Extraction error: {e}")
        
        return results
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None

# Initialize scraper instance
scraper = SeleniumScraper()

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/scrape', methods=['POST'])
def api_scrape():
    """API endpoint to scrape a URL"""
    data = request.json
    url = data.get('url', '')
    wait_time = data.get('wait_time', 3)
    
    if not url:
        return jsonify({'success': False, 'error': 'URL is required'})
    
    # Validate URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    try:
        html, error = scraper.scrape_url(url, wait_time)
        if error:
            return jsonify({'success': False, 'error': error})
        
        # Store the scraped data
        session_id = str(uuid.uuid4())
        scraped_data_store[session_id] = {
            'url': url,
            'html': html,
            'timestamp': datetime.now().isoformat()
        }
        
        # Parse for preview
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.title.string if soup.title else 'No title'

        return jsonify({
            'success': True,
            'session_id': session_id,
            'title': title,
            'html_length': len(html),
            'preview': html  # Return full HTML, not truncated
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/get_elements', methods=['POST'])
def get_elements():
    """Get all elements from scraped page for visual selector"""
    data = request.json
    session_id = data.get('session_id', '')
    
    if session_id not in scraped_data_store:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    html = scraped_data_store[session_id]['html']
    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract common elements
    elements = {
        'headings': [],
        'links': [],
        'images': [],
        'paragraphs': [],
        'divs': [],
        'spans': [],
        'tables': [],
        'lists': [],
        'forms': [],
        'buttons': [],
        'inputs': []
    }
    
    # Extract headings
    for i, h in enumerate(soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])):
        elements['headings'].append({
            'index': i,
            'tag': h.name,
            'text': h.get_text(strip=True)[:100],
            'selector': scraper._get_css_selector(h),
            'id': h.get('id', ''),
            'class': ' '.join(h.get('class', []))
        })
    
    # Extract links
    for i, a in enumerate(soup.find_all('a', href=True)):
        elements['links'].append({
            'index': i,
            'text': a.get_text(strip=True)[:50],
            'href': a['href'],
            'selector': f"a[href='{a['href']}']",
            'id': a.get('id', ''),
            'class': ' '.join(a.get('class', []))
        })
    
    # Extract images
    for i, img in enumerate(soup.find_all('img')):
        elements['images'].append({
            'index': i,
            'src': img.get('src', ''),
            'alt': img.get('alt', ''),
            'selector': f"img[alt='{img.get('alt', '')}']" if img.get('alt') else f"img[src*='{img.get('src', '').split('/')[-1]}']",
            'id': img.get('id', ''),
            'class': ' '.join(img.get('class', []))
        })
    
    # Extract paragraphs
    for i, p in enumerate(soup.find_all('p')):
        text = p.get_text(strip=True)
        if text:
            elements['paragraphs'].append({
                'index': i,
                'text': text[:150],
                'selector': scraper._get_css_selector(p),
                'id': p.get('id', ''),
                'class': ' '.join(p.get('class', []))
            })
    
    # Extract tables
    for i, table in enumerate(soup.find_all('table')):
        elements['tables'].append({
            'index': i,
            'rows': len(table.find_all('tr')),
            'selector': scraper._get_css_selector(table),
            'id': table.get('id', ''),
            'class': ' '.join(table.get('class', []))
        })
    
    # Extract lists
    for i, ul in enumerate(soup.find_all(['ul', 'ol'])):
        items = len(ul.find_all('li'))
        elements['lists'].append({
            'index': i,
            'tag': ul.name,
            'items': items,
            'selector': scraper._get_css_selector(ul),
            'id': ul.get('id', ''),
            'class': ' '.join(ul.get('class', []))
        })
    
    # Extract forms
    for i, form in enumerate(soup.find_all('form')):
        elements['forms'].append({
            'index': i,
            'action': form.get('action', ''),
            'selector': scraper._get_css_selector(form),
            'id': form.get('id', ''),
            'class': ' '.join(form.get('class', []))
        })
    
    # Extract buttons
    for i, btn in enumerate(soup.find_all(['button', 'input[type="submit"]'])):
        elements['buttons'].append({
            'index': i,
            'text': btn.get_text(strip=True) or btn.get('value', ''),
            'selector': scraper._get_css_selector(btn),
            'id': btn.get('id', ''),
            'class': ' '.join(btn.get('class', []))
        })
    
    # Extract inputs
    for i, inp in enumerate(soup.find_all('input')):
        elements['inputs'].append({
            'index': i,
            'type': inp.get('type', 'text'),
            'name': inp.get('name', ''),
            'placeholder': inp.get('placeholder', ''),
            'selector': f"input[name='{inp.get('name', '')}']" if inp.get('name') else f"input[type='{inp.get('type', 'text')}']",
            'id': inp.get('id', ''),
            'class': ' '.join(inp.get('class', []))
        })
    
    return jsonify({'success': True, 'elements': elements})

@app.route('/api/extract', methods=['POST'])
def api_extract():
    """Extract data using a rule"""
    data = request.json
    session_id = data.get('session_id', '')
    rule = data.get('rule', {})
    
    if session_id not in scraped_data_store:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    html = scraped_data_store[session_id]['html']
    scraper.html_content = html
    scraper.soup = BeautifulSoup(html, 'html.parser')
    
    results = scraper.extract_by_rule(rule)
    
    return jsonify({
        'success': True,
        'results': results,
        'count': len(results)
    })

@app.route('/api/save_rule', methods=['POST'])
def save_rule():
    """Save an extraction rule"""
    data = request.json
    rule_id = str(uuid.uuid4())
    
    extraction_rules_store[rule_id] = {
        'id': rule_id,
        'name': data.get('name', 'Unnamed Rule'),
        'selector_type': data.get('selector_type', 'css'),
        'selector': data.get('selector', ''),
        'attribute': data.get('attribute', 'text'),
        'created_at': datetime.now().isoformat()
    }
    
    return jsonify({'success': True, 'rule_id': rule_id})

@app.route('/api/get_rules', methods=['GET'])
def get_rules():
    """Get all saved extraction rules"""
    return jsonify({
        'success': True,
        'rules': list(extraction_rules_store.values())
    })

@app.route('/api/delete_rule/<rule_id>', methods=['DELETE'])
def delete_rule(rule_id):
    """Delete an extraction rule"""
    if rule_id in extraction_rules_store:
        del extraction_rules_store[rule_id]
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Rule not found'})

@app.route('/api/export', methods=['POST'])
def export_data():
    """Export extracted data to various formats"""
    data = request.json
    export_format = data.get('format', 'json')
    extracted_data = data.get('data', [])

    if not extracted_data:
        return jsonify({'success': False, 'error': 'No data to export'})

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"extracted_data_{timestamp}"

    # Use Windows-compatible temp directory
    temp_dir = tempfile.gettempdir()

    try:
        if export_format == 'json':
            # Export as structured JSON with rule names as keys
            filepath = os.path.join(temp_dir, f"{filename}.json")
            # Reorganize data by rule name
            structured_data = {}
            for item in extracted_data:
                rule_name = item.get('rule', 'unnamed')
                value = item.get('value', '')
                if rule_name not in structured_data:
                    structured_data[rule_name] = []
                structured_data[rule_name].append(value)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(structured_data, f, indent=2, ensure_ascii=False)
            return send_file(filepath, as_attachment=True, download_name=f"{filename}.json")

        elif export_format == 'csv':
            # Export with columns: rule, index, value
            filepath = os.path.join(temp_dir, f"{filename}.csv")
            # Prepare data for CSV - handle nested objects
            csv_data = []
            for item in extracted_data:
                row = {
                    'rule': item.get('rule', 'unnamed'),
                    'index': item.get('index', ''),
                    'value': item.get('value', '')
                }
                # If value is a dict/list, convert to JSON string
                if isinstance(row['value'], (dict, list)):
                    row['value'] = json.dumps(row['value'], ensure_ascii=False)
                csv_data.append(row)
            df = pd.DataFrame(csv_data)
            df.to_csv(filepath, index=False, encoding='utf-8', quoting=1)  # QUOTE_ALL
            return send_file(filepath, as_attachment=True, download_name=f"{filename}.csv")

        elif export_format == 'txt':
            # Export as clean text with rule headers
            filepath = os.path.join(temp_dir, f"{filename}.txt")
            # Group by rule name for cleaner output
            rules_data = {}
            for item in extracted_data:
                rule_name = item.get('rule', 'unnamed')
                value = item.get('value', '')
                if rule_name not in rules_data:
                    rules_data[rule_name] = []
                rules_data[rule_name].append(value)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                for rule_name, values in rules_data.items():
                    f.write(f"=== {rule_name} ===\n")
                    f.write("-" * 50 + "\n")
                    for i, value in enumerate(values, 1):
                        # Handle dict/list values
                        if isinstance(value, (dict, list)):
                            value = json.dumps(value, ensure_ascii=False, indent=2)
                        f.write(f"{i}. {value}\n")
                    f.write("\n")
            return send_file(filepath, as_attachment=True, download_name=f"{filename}.txt")

        else:
            return jsonify({'success': False, 'error': 'Unsupported format'})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/preview_html', methods=['POST'])
def preview_html():
    """Get HTML preview for visual selector"""
    data = request.json
    session_id = data.get('session_id', '')

    if session_id not in scraped_data_store:
        return jsonify({'success': False, 'error': 'Session not found'})

    html = scraped_data_store[session_id]['html']

    # Add base tag to resolve relative URLs and highlight script for visual selection
    base_script = '''
    <base href="''' + scraped_data_store[session_id]['url'] + '''">
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        let selectedElement = null;

        // Add visual selection to all elements
        document.querySelectorAll('*').forEach(el => {
            el.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                this.style.outline = '2px solid #3b82f6';
                this.style.cursor = 'pointer';
            });

            el.addEventListener('mouseout', function(e) {
                e.stopPropagation();
                if (this !== selectedElement) {
                    this.style.outline = '';
                    this.style.cursor = '';
                }
            });

            el.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (selectedElement) {
                    selectedElement.style.outline = '';
                }
                selectedElement = this;
                this.style.outline = '3px solid #10b981';

                // Send element info to parent
                window.parent.postMessage({
                    type: 'element_selected',
                    tag: this.tagName,
                    id: this.id,
                    className: this.className,
                    text: this.textContent.trim().substring(0, 100)
                }, '*');
            });
        });

        // Prevent navigation
        document.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });
    });
    </script>
    '''

    # Insert after opening head tag or at beginning
    if '<head>' in html:
        html = html.replace('<head>', '<head>' + base_script, 1)
    else:
        # If no head tag, insert at beginning
        html = base_script + html

    return jsonify({'success': True, 'html': html})

@app.route('/api/download_html', methods=['POST'])
def download_html():
    """Download full HTML file"""
    data = request.json
    session_id = data.get('session_id', '')

    if session_id not in scraped_data_store:
        return jsonify({'success': False, 'error': 'Session not found'})

    html = scraped_data_store[session_id]['html']
    url = scraped_data_store[session_id]['url']
    
    # Create a safe filename from URL
    from urllib.parse import urlparse
    parsed_url = urlparse(url)
    filename = parsed_url.netloc.replace('.', '_') + '_page.html'
    
    # Save to temp file and send
    import tempfile
    import os
    temp_dir = tempfile.gettempdir()
    filepath = os.path.join(temp_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return send_file(filepath, as_attachment=True, download_name=filename)

@app.route('/api/batch_extract', methods=['POST'])
def batch_extract():
    """Run multiple extraction rules at once"""
    data = request.json
    session_id = data.get('session_id', '')
    rules = data.get('rules', [])
    
    if session_id not in scraped_data_store:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    html = scraped_data_store[session_id]['html']
    scraper.html_content = html
    scraper.soup = BeautifulSoup(html, 'html.parser')
    
    results = {}
    for rule in rules:
        rule_name = rule.get('name', 'unnamed')
        extracted = scraper.extract_by_rule(rule)
        results[rule_name] = extracted
    
    return jsonify({
        'success': True,
        'results': results
    })

if __name__ == '__main__':
    print("=" * 60)
    print("ScrapeBI - No-Code Web Scraping Tool")
    print("=" * 60)
    print("Starting server at http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 60)

    try:
        app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
    finally:
        scraper.close()
