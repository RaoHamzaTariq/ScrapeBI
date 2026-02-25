# Contributing Guide

Thank you for your interest in contributing to ScrapeBI! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)
- [Testing](#testing)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in ScrapeBI a harassment-free experience for everyone. We welcome contributors of all backgrounds and experience levels.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Offensive comments
- Trolling or insulting
- Publishing others' private information

### Enforcement

Report unacceptable behavior to the project maintainer. All complaints will be reviewed and investigated.

---

## How to Contribute

### Ways to Help

| Contribution Type | Description |
|-------------------|-------------|
| 🐛 **Bug Reports** | Report bugs you find |
| 💡 **Feature Requests** | Suggest new features |
| 📝 **Documentation** | Improve docs, fix typos |
| 🔧 **Code Contributions** | Fix bugs, add features |
| 🎨 **Design** | Improve UI/UX |
| 🧪 **Testing** | Test new features |
| 🌍 **Translations** | Help localize ScrapeBI |
| 📢 **Spread the Word** | Star, share, recommend |

---

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- Google Chrome
- Code editor (VS Code recommended)

### Fork the Repository

1. Click "Fork" on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ScrapeBI.git
   cd ScrapeBI
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/RaoHamzaTariq/ScrapeBI.git
   ```

### Set Up Development Environment

```bash
# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-cov black flake8
```

### Verify Setup

```bash
# Run tests
pytest

# Check code style
black --check .
flake8
```

---

## Development Workflow

### Branch Naming

```
feature/add-new-feature
bugfix/fix-scraping-error
docs/update-readme
refactor/improve-performance
```

### Commit Messages

**Format:**
```
type: short description

longer description (optional)

fixes #123 (optional)
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

**Examples:**
```
feat: add batch export functionality

fix: resolve selector not working on dynamic sites

docs: update installation guide with Windows instructions
```

### Making Changes

1. **Create branch:**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push to fork:**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill in PR template

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No unnecessary changes
- [ ] Commits are squashed if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Tested manually
- [ ] All tests pass

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks**
   - Tests run automatically
   - Code style checked
   - Build verified

2. **Maintainer Review**
   - Code quality assessment
   - Functionality verification
   - Suggestions provided

3. **Approval & Merge**
   - Changes requested (if any)
   - Final approval
   - Merge to main branch

---

## Coding Standards

### Python Style

Follow [PEP 8](https://pep8.org/):

```python
# Good
def scrape_url(url, wait_time=3):
    """Scrape a URL and return HTML."""
    pass

# Bad
def ScrapeURL(Url,wait_time=3):
    pass
```

### Code Organization

```python
# Imports first
import os
import json

# Then constants
DEFAULT_WAIT_TIME = 3

# Then functions
def function_name():
    pass

# Then classes
class ClassName:
    pass
```

### Documentation

**Docstrings:**
```python
def extract_data(selector, attribute='text'):
    """
    Extract data using selector.
    
    Args:
        selector: CSS or XPath selector
        attribute: What to extract (default: 'text')
    
    Returns:
        list: Extracted data items
    """
    pass
```

### JavaScript Style

```javascript
// Use const/let instead of var
const value = getValue();

// Arrow functions for callbacks
items.forEach(item => {
    process(item);
});

// Template literals
const message = `Hello, ${name}!`;
```

---

## Documentation

### Writing Documentation

**Guidelines:**
- Use clear, simple language
- Include examples
- Add screenshots when helpful
- Keep up to date

**File Location:**
```
docs/
├── feature-guide.md    # New feature docs
├── api-reference.md    # API updates
└── README.md           # Main readme
```

### Documentation Style

```markdown
# Feature Name

Brief description.

## Usage

How to use it.

## Examples

Code examples.

## Notes

Additional information.
```

---

## Testing

### Running Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific test
pytest tests/test_scraping.py
```

### Writing Tests

```python
def test_scrape_basic_website():
    """Test scraping a basic website."""
    result = scrape_url('https://example.com', wait_time=2)
    assert result.success is True
    assert result.html is not None
    assert len(result.html) > 0
```

### Test Coverage

Aim for:
- ✅ 80%+ coverage
- ✅ Test edge cases
- ✅ Test error conditions
- ✅ Test common use cases

---

## Bug Reports

### Before Reporting

- [ ] Check existing issues
- [ ] Try latest version
- [ ] Gather information

### Bug Report Template

```markdown
## Description
What's wrong?

## To Reproduce
Steps to reproduce:
1. Go to '...'
2. Click '...'
3. See error

## Expected Behavior
What should happen?

## Screenshots
If applicable.

## Environment
- OS: [e.g., Windows 11]
- Python: [e.g., 3.10]
- Browser: [e.g., Chrome 120]
- ScrapeBI: [e.g., v1.0]

## Additional Context
Any other details.
```

---

## Feature Requests

### Before Requesting

- [ ] Check existing requests
- [ ] Consider if it fits project scope
- [ ] Think about implementation

### Feature Request Template

```markdown
## Problem
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other ways to solve this?

## Additional Context
Examples, mockups, etc.
```

---

## Recognition

### Contributors

We recognize contributors in:
- README.md
- Release notes
- Contributor list

### Becoming a Maintainer

Active contributors may be invited to become maintainers:
- Consistent contributions
- Quality code
- Community involvement
- Project alignment

---

## Questions?

### Getting Help

- Check [FAQ](faq.md)
- Read [Documentation](README.md)
- Ask in GitHub Discussions
- Contact maintainer

### Communication

- **GitHub Issues:** Bugs, features
- **GitHub Discussions:** Questions, ideas
- **Email:** Via GitHub profile

---

## Thank You!

Every contribution helps make ScrapeBI better. Whether it's a typo fix, bug report, or new feature - we appreciate it!

**Happy Contributing! 🎉**
