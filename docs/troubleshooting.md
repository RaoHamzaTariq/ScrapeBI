# Troubleshooting Guide

Common issues and their solutions for ScrapeBI.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Runtime Errors](#runtime-errors)
- [Scraping Issues](#scraping-issues)
- [Element Detection](#element-detection)
- [Export Problems](#export-problems)
- [Performance Issues](#performance-issues)
- [Browser Issues](#browser-issues)

## Installation Issues

### Python Not Found

**Error:** `python: command not found`

**Solutions:**
1. Install Python from [python.org](https://www.python.org)
2. Add Python to system PATH
3. Try `python3` instead of `python`

**Verify:**
```bash
python --version
```

### Module Not Found

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solutions:**
```bash
# Activate virtual environment first
pip install -r requirements.txt

# Or install individually
pip install flask selenium beautifulsoup4 pandas lxml webdriver-manager requests
```

### Permission Denied

**Error:** `Permission denied` (macOS/Linux)

**Solutions:**
```bash
# Make scripts executable
chmod +x start.sh
chmod +x run.py

# Or run with sudo (not recommended)
sudo python run.py
```

## Runtime Errors

### Port Already in Use

**Error:** `Address already in use: port 5000`

**Solutions:**
1. Close other applications using port 5000
2. Change port in `app.py`:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```
3. Find and kill process:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### ChromeDriver Session Error

**Error:** `invalid session id` or `session not created`

**Solutions:**
1. Restart ScrapeBI
2. Clear browser cache
3. Update ChromeDriver:
   ```bash
   pip install --upgrade webdriver-manager
   ```

### WebDriver Exception

**Error:** `Message: unknown error: cannot find Chrome binary`

**Solutions:**
1. Install Google Chrome
2. Ensure Chrome is in PATH
3. Specify Chrome location:
   ```python
   # In app.py, modify Chrome options
   chrome_options.binary_location = "/path/to/chrome"
   ```

## Scraping Issues

### Page Not Loading

**Symptoms:** Preview shows blank or error

**Solutions:**
1. **Increase wait time** - Try 5-10 seconds
2. **Check URL** - Ensure it's valid and accessible
3. **Website blocks bots:**
   - Some sites block automated browsers
   - Try different website
   - Check robots.txt

4. **Network issues:**
   - Check internet connection
   - Try incognito mode in browser
   - Clear browser cache

### Timeout Error

**Error:** `TimeoutException: Message: timeout`

**Solutions:**
1. Increase wait time in input field
2. Website might be slow - be patient
3. Check website manually in browser
4. Some pages never fully load - try different page

### JavaScript Not Rendering

**Symptoms:** Page loads but dynamic content missing

**Solutions:**
1. **Increase wait time** - Give JS time to execute
2. **Use Visual Selector** - See what actually loaded
3. **Check console** - Look for JS errors
4. **Try different page** - Some sites are too complex

## Element Detection

### No Elements Detected

**Symptoms:** Element list is empty

**Solutions:**
1. **Verify page scraped successfully**
2. **Check HTML tab** - See if content exists
3. **Website might use frames:**
   - Content in iframes not detected
   - Try scraping iframe URL directly

4. **Dynamic loading:**
   - Increase wait time
   - Content loads after scrape completes

### Wrong Elements Selected

**Symptoms:** Selector returns unexpected elements

**Solutions:**
1. **Be more specific:**
   ```css
   /* Too broad */
   .title
   
   /* More specific */
   .product-card .title
   ```

2. **Use browser DevTools** to verify selector
3. **Test in Console:**
   ```javascript
   document.querySelectorAll('.your-selector')
   ```

### Element Text Empty

**Symptoms:** Extracted text is blank

**Solutions:**
1. **Element might contain only other elements**
   - Try extracting from child elements
   - Use "HTML Content" instead of "Text"

2. **Text loaded dynamically:**
   - Increase wait time
   - Text might be in JavaScript

3. **Check for whitespace:**
   - Element has no visible text
   - Try parent or child elements

## Export Problems

### Export Button Not Working

**Solutions:**
1. **Run extraction first** - Must have results to export
2. **Check browser popup blocker** - Allow downloads
3. **Try different browser** - Some browsers block downloads
4. **Clear browser cache**

### CSV Format Issues

**Problems:** Special characters, encoding issues

**Solutions:**
1. Open CSV in text editor first
2. Import to Excel with UTF-8 encoding
3. Use JSON export for complex data
4. Check for commas in data (causes column issues)

### JSON Export Empty

**Solutions:**
1. Verify extraction ran successfully
2. Check results tab has data
3. Try different export format
4. Refresh page and try again

## Performance Issues

### Slow Scraping

**Symptoms:** Takes too long to scrape

**Solutions:**
1. **Reduce wait time** - If page loads fast
2. **Scrape specific pages** - Not entire site
3. **Close other applications** - Free up resources
4. **Check internet speed** - Slow connection affects scraping

### High Memory Usage

**Symptoms:** Computer slows down

**Solutions:**
1. **Close and reopen ScrapeBI** - Clear memory
2. **Reduce batch size** - Fewer rules at once
3. **Export and clear results** - Free up memory
4. **Restart browser** - Clear iframe memory

### Browser Crashes

**Solutions:**
1. **Reduce page complexity** - Some pages are too large
2. **Increase system resources** - Close other apps
3. **Update Chrome** - Latest version more stable
4. **Clear Chrome cache** - Remove corrupted data

## Browser Issues

### Chrome Not Opening

**Solutions:**
1. Install Google Chrome
2. Set Chrome as default browser
3. Check Chrome installation:
   ```bash
   # Windows
   "C:\Program Files\Google\Chrome\Application\chrome.exe"
   
   # macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
   ```

### Popup Blocker

**Symptoms:** Download doesn't start

**Solutions:**
1. Allow popups for localhost:5000
2. Check browser settings
3. Click download button again
4. Check downloads folder

### Cookie/Session Issues

**Symptoms:** Website requires login

**Solutions:**
1. **Manual login first:**
   - Open URL in regular Chrome
   - Login to website
   - Then scrape in ScrapeBI

2. **Use browser extension** to export cookies
3. **Some sites can't be scraped** - Login-protected

## Anti-Scraping Measures

### Website Blocks Request

**Symptoms:** 403 Forbidden or CAPTCHA

**Solutions:**
1. **Respect robots.txt** - Check if scraping allowed
2. **Reduce request frequency** - Don't scrape too fast
3. **Use longer wait times** - Appear more human
4. **Some sites can't be scraped** - Find alternative

### Rate Limiting

**Symptoms:** Works first time, then blocked

**Solutions:**
1. **Wait before scraping again** - 5-10 minutes
2. **Use different IP** - If possible
3. **Reduce scraping frequency** - Be respectful
4. **Contact website owner** - For API access

## Getting More Help

### Check Logs

1. Look at console output for errors
2. Check browser console (F12)
3. Review ScrapeBI terminal output

### Debug Mode

Enable debug mode in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Report Issues

When reporting bugs, include:
1. Error message (full text)
2. Steps to reproduce
3. Website URL (if applicable)
4. Browser and Python version
5. Operating system

### Resources

- [Installation Guide](installation.md)
- [Quick Start](quickstart.md)
- [FAQ](faq.md)
- GitHub Issues

---

**Still having issues?** Open an issue on GitHub with detailed information about your problem.
