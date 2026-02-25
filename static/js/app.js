// ScrapeBI - Enhanced Frontend JavaScript
// Modern interactions, animations, and improved UX

let currentSessionId = null;
let currentHtml = '';
let selectedElement = null;
let extractionRules = [];
let extractionResults = {};
let currentStep = 1;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadSavedRules();
    initializeEventListeners();
    updateStepIndicator(1);

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'element_selected') {
            handleElementSelection(event.data);
        }
    });

    // Check connection status
    checkConnectionStatus();
});

// Format HTML with proper indentation
function formatHtml(html) {
    if (!html) return '';
    
    // For very large HTML, just return a message
    if (html.length > 500000) {
        return null; // Signal that it's too large to display
    }
    
    let formatted = '';
    let indent = 0;
    html.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent -= 1;
        formatted += new Array(indent + 1).join('  ') + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('!')) indent += 1;
    });
    return formatted.substring(1, formatted.length - 3);
}

// Check server connection status
async function checkConnectionStatus() {
    try {
        const response = await fetch('/api/get_rules');
        if (response.ok) {
            updateConnectionStatus('connected');
        } else {
            updateConnectionStatus('disconnected');
        }
    } catch (error) {
        updateConnectionStatus('disconnected');
    }
}

// Update connection status indicator
function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connectionStatus');
    if (status === 'connected') {
        statusEl.innerHTML = `
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-semibold text-green-700">Ready</span>
        `;
        statusEl.className = 'flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full';
    } else {
        statusEl.innerHTML = `
            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
            <span class="text-xs font-semibold text-red-700">Disconnected</span>
        `;
        statusEl.className = 'flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Enter key to scrape
    const urlInput = document.getElementById('urlInput');
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scrapeUrl();
        }
    });

    // Auto-format URL on blur
    urlInput.addEventListener('blur', function() {
        let url = this.value.trim();
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            this.value = 'https://' + url;
        }
    });
}

// Show toast notification with enhanced styling
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon text-xl"></i>
        <div class="flex-1">
            <p class="font-semibold text-sm">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 transition">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Update progress step indicator
function updateStepIndicator(step) {
    currentStep = step;

    document.querySelectorAll('.step-item').forEach(item => {
        const itemStep = parseInt(item.dataset.step);
        const circle = item.querySelector('.step-circle');
        const textPrimary = item.querySelector('p:first-child');
        const textSecondary = item.querySelector('p:last-child');

        if (itemStep < step) {
            // Completed step
            circle.className = 'step-circle w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm';
            circle.style.background = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
            circle.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
            circle.innerHTML = '<i class="fas fa-check"></i>';
            if (textPrimary) {
                textPrimary.className = 'text-sm font-semibold text-emerald-400';
            }
            if (textSecondary) {
                textSecondary.className = 'text-xs text-emerald-500';
            }
        } else if (itemStep === step) {
            // Active step
            circle.className = 'step-circle w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm';
            circle.style.background = 'linear-gradient(135deg, #2E9BFF 0%, #7CFBFF 100%)';
            circle.style.boxShadow = '0 0 20px rgba(46, 155, 255, 0.4)';
            if (textPrimary) {
                textPrimary.className = 'text-sm font-semibold text-white';
            }
            if (textSecondary) {
                textSecondary.className = 'text-xs text-gray-300';
            }
        } else {
            // Pending step
            circle.className = 'step-circle w-10 h-10 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm';
            circle.style.background = '#0F2050';
            if (textPrimary) {
                textPrimary.className = 'text-sm font-semibold text-gray-400';
            }
            if (textSecondary) {
                textSecondary.className = 'text-xs text-gray-500';
            }
        }
    });

    // Update step lines
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index < step - 1) {
            line.style.background = '#10B981';
        } else {
            line.style.background = '#4B5563';
        }
    });
}

// Switch tabs - simplified and reliable
function switchTab(tabName, btnElement) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs immediately
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate the clicked button
    if (btnElement) {
        btnElement.classList.add('active');
    }

    // Show the selected tab
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.remove('hidden');
        console.log('Showing tab:', tabName);
    } else {
        console.error('Tab not found:', tabName + 'Tab');
    }

    // Update step indicator based on tab
    const stepMap = {
        'visual': 2,
        'elements': 2,
        'html': 2,
        'extraction': 3,
        'results': 4
    };
    
    if (stepMap[tabName] && currentStep < stepMap[tabName]) {
        updateStepIndicator(stepMap[tabName]);
    }
    
    // Hide HTML info when switching away from HTML tab
    if (tabName !== 'html') {
        const htmlInfo = document.getElementById('htmlInfo');
        if (htmlInfo) htmlInfo.classList.add('hidden');
    }
}

// Scrape URL with enhanced feedback
async function scrapeUrl() {
    const url = document.getElementById('urlInput').value.trim();
    const waitTime = document.getElementById('waitTime').value;

    if (!url) {
        showToast('Please enter a URL', 'warning');
        document.getElementById('urlInput').focus();
        return;
    }

    const scrapeBtn = document.getElementById('scrapeBtn');
    const scrapeStatus = document.getElementById('scrapeStatus');
    const scrapeProgress = document.getElementById('scrapeProgress');

    // Disable button and show loading state
    scrapeBtn.disabled = true;
    scrapeBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Scraping...</span>
    `;
    scrapeStatus.classList.remove('hidden');

    // Hide HTML info
    const htmlInfo = document.getElementById('htmlInfo');
    if (htmlInfo) htmlInfo.classList.add('hidden');

    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 80) {
            progress += Math.random() * 15;
            scrapeProgress.style.width = Math.min(progress, 80) + '%';
        }
    }, 300);

    try {
        console.log('Scraping URL:', url);
        
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, wait_time: parseInt(waitTime) })
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        clearInterval(progressInterval);
        scrapeProgress.style.width = '100%';

        if (data.success) {
            currentSessionId = data.session_id;
            currentHtml = data.preview;

            // Update session info
            document.getElementById('sessionInfo').innerHTML = '<span class="badge badge-success"><i class="fas fa-check-circle"></i> Active Session</span>';
            document.getElementById('pageInfo').classList.remove('hidden');
            document.getElementById('pageUrl').textContent = url;
            document.getElementById('pageTitle').textContent = data.title;

            // Update HTML code view with formatted HTML (first 500 lines for preview)
            const formattedHtml = formatHtml(data.preview);
            const htmlCodeEl = document.getElementById('htmlCode');
            const htmlInfo = document.getElementById('htmlInfo');
            const htmlStats = document.getElementById('htmlStats');

            if (formattedHtml === null) {
                // HTML too large to format, show raw preview
                const rawPreview = data.preview.substring(0, 50000);
                htmlCodeEl.textContent = rawPreview + '\n\n... [HTML too large to display - use Download button to get full file]';
                htmlInfo.classList.remove('hidden');
                htmlStats.textContent = `Size: ${(data.preview.length / 1024).toFixed(2)} KB • Too large to display formatted`;
            } else {
                const lines = formattedHtml.split('\n');
                const previewLines = lines.slice(0, 500);
                const previewHtml = previewLines.join('\n');
                const displayHtml = previewHtml + (lines.length > 500 ? '\n\n... [' + (lines.length - 500) + ' more lines - use Download to get full HTML]' : '');

                htmlCodeEl.textContent = displayHtml;
                htmlInfo.classList.remove('hidden');
                htmlStats.textContent = `Total lines: ${lines.length.toLocaleString()} • Size: ${(formattedHtml.length / 1024).toFixed(2)} KB`;
            }

            // Load elements and preview
            await loadElements();
            await loadPreview();

            // Update step indicator
            updateStepIndicator(2);

            showToast('Website scraped successfully!', 'success');
        } else {
            showToast('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Scraping error:', error);
        showToast('Error scraping website: ' + error.message, 'error');
    } finally {
        // Always reset button state
        scrapeBtn.disabled = false;
        scrapeBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Scrape Website</span>
        `;
        scrapeStatus.classList.add('hidden');
        scrapeProgress.style.width = '0%';
        
        // Clear progress interval if still running
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    }
}

// Load elements from scraped page
async function loadElements() {
    if (!currentSessionId) return;

    try {
        const response = await fetch('/api/get_elements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: currentSessionId })
        });

        const data = await response.json();

        if (data.success) {
            renderElements(data.elements);
        }
    } catch (error) {
        console.error('Error loading elements:', error);
        showToast('Failed to load elements', 'error');
    }
}

// Render elements with enhanced UI
function renderElements(elements) {
    const container = document.getElementById('elementsContainer');
    let html = '';
    let totalElements = 0;

    // Count total elements
    Object.values(elements).forEach(arr => totalElements += arr.length);

    if (totalElements === 0) {
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <i class="fas fa-search text-4xl text-gray-300"></i>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">No Elements Detected</h4>
                <p class="text-gray-500">The page may not have standard HTML elements</p>
            </div>
        `;
        return;
    }

    // Headings
    if (elements.headings.length > 0) {
        html += createAccordion('headings', `
            <div class="flex items-center gap-2">
                <i class="fas fa-heading text-blue-500"></i>
                <span>Headings</span>
                <span class="badge badge-primary">${elements.headings.length}</span>
            </div>
        `, elements.headings.map(h => `
            <div class="element-card" onclick="selectElement('headings', ${h.index}, '${h.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <i class="fas fa-heading text-blue-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="badge badge-primary">${h.tag}</span>
                        <span class="ml-2 text-sm text-gray-700">${h.text || '<em>No text</em>'}</span>
                        <code class="text-xs text-gray-500 ml-2 block mt-1">${h.selector}</code>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Links
    if (elements.links.length > 0) {
        html += createAccordion('links', `
            <div class="flex items-center gap-2">
                <i class="fas fa-link text-green-500"></i>
                <span>Links</span>
                <span class="badge badge-success">${elements.links.length}</span>
            </div>
        `, elements.links.map(l => `
            <div class="element-card" onclick="selectElement('links', ${l.index}, '${l.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <i class="fas fa-link text-green-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="badge badge-success">LINK</span>
                        <span class="ml-2 text-sm text-gray-700">${l.text || '<em>No text</em>'}</span>
                        <code class="text-xs text-gray-500 ml-2 block mt-1 truncate">${l.href}</code>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Images
    if (elements.images.length > 0) {
        html += createAccordion('images', `
            <div class="flex items-center gap-2">
                <i class="fas fa-image text-purple-500"></i>
                <span>Images</span>
                <span class="badge badge-info">${elements.images.length}</span>
            </div>
        `, elements.images.map(img => `
            <div class="element-card" onclick="selectElement('images', ${img.index}, '${img.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <i class="fas fa-image text-purple-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="badge badge-info">IMG</span>
                        <span class="ml-2 text-sm text-gray-700">${img.alt || '<em>No alt text</em>'}</span>
                        <code class="text-xs text-gray-500 ml-2 block mt-1 truncate">${img.src}</code>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Paragraphs
    if (elements.paragraphs.length > 0) {
        html += createAccordion('paragraphs', `
            <div class="flex items-center gap-2">
                <i class="fas fa-paragraph text-orange-500"></i>
                <span>Paragraphs</span>
                <span class="badge badge-warning">${elements.paragraphs.length}</span>
            </div>
        `, elements.paragraphs.map(p => `
            <div class="element-card" onclick="selectElement('paragraphs', ${p.index}, '${p.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <i class="fas fa-paragraph text-orange-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="badge badge-warning">P</span>
                        <span class="ml-2 text-sm text-gray-700">${p.text.substring(0, 80)}${p.text.length > 80 ? '...' : ''}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Tables
    if (elements.tables.length > 0) {
        html += createAccordion('tables', `
            <div class="flex items-center gap-2">
                <i class="fas fa-table text-red-500"></i>
                <span>Tables</span>
                <span class="badge badge-danger">${elements.tables.length}</span>
            </div>
        `, elements.tables.map(t => `
            <div class="element-card" onclick="selectElement('tables', ${t.index}, '${t.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <i class="fas fa-table text-red-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <span class="badge badge-danger">TABLE</span>
                        <span class="ml-2 text-sm text-gray-700">${t.rows} row${t.rows !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Lists
    if (elements.lists.length > 0) {
        html += createAccordion('lists', `
            <div class="flex items-center gap-2">
                <i class="fas fa-list text-indigo-500"></i>
                <span>Lists</span>
                <span class="badge badge-primary">${elements.lists.length}</span>
            </div>
        `, elements.lists.map(l => `
            <div class="element-card" onclick="selectElement('lists', ${l.index}, '${l.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <i class="fas fa-list text-indigo-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <span class="badge badge-primary">${l.tag.toUpperCase()}</span>
                        <span class="ml-2 text-sm text-gray-700">${l.items} item${l.items !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Forms
    if (elements.forms.length > 0) {
        html += createAccordion('forms', `
            <div class="flex items-center gap-2">
                <i class="fas fa-envelope text-yellow-500"></i>
                <span>Forms</span>
                <span class="badge badge-warning">${elements.forms.length}</span>
            </div>
        `, elements.forms.map(f => `
            <div class="element-card" onclick="selectElement('forms', ${f.index}, '${f.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <i class="fas fa-envelope text-yellow-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <span class="badge badge-warning">FORM</span>
                        <span class="ml-2 text-sm text-gray-700">${f.action || '<em>No action</em>'}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Buttons
    if (elements.buttons.length > 0) {
        html += createAccordion('buttons', `
            <div class="flex items-center gap-2">
                <i class="fas fa-square text-cyan-500"></i>
                <span>Buttons</span>
                <span class="badge badge-info">${elements.buttons.length}</span>
            </div>
        `, elements.buttons.map(b => `
            <div class="element-card" onclick="selectElement('buttons', ${b.index}, '${b.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <i class="fas fa-square text-cyan-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <span class="badge badge-info">BTN</span>
                        <span class="ml-2 text-sm text-gray-700">${b.text || '<em>No text</em>'}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    // Inputs
    if (elements.inputs.length > 0) {
        html += createAccordion('inputs', `
            <div class="flex items-center gap-2">
                <i class="fas fa-edit text-pink-500"></i>
                <span>Inputs</span>
                <span class="badge badge-secondary">${elements.inputs.length}</span>
            </div>
        `, elements.inputs.map(i => `
            <div class="element-card" onclick="selectElement('inputs', ${i.index}, '${i.selector}')">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                        <i class="fas fa-edit text-pink-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <span class="badge badge-secondary">${i.type.toUpperCase()}</span>
                        <span class="ml-2 text-sm text-gray-700">${i.name || i.placeholder || '<em>Unnamed</em>'}</span>
                    </div>
                </div>
            </div>
        `).join(''));
    }

    container.innerHTML = html || '<div class="text-center py-16 text-gray-500">No elements detected</div>';
    
    // Auto-expand first accordion
    const firstAccordion = container.querySelector('.accordion-header');
    if (firstAccordion) {
        firstAccordion.click();
    }
}

// Create accordion component
function createAccordion(id, title, content) {
    return `
        <div class="accordion mb-4">
            <button class="accordion-header" onclick="toggleAccordion('${id}')">
                <span>${title}</span>
                <i class="fas fa-chevron-down accordion-icon"></i>
            </button>
            <div id="accordion-${id}" class="accordion-content">
                <div class="accordion-body max-h-96 overflow-y-auto">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

// Toggle accordion with smooth animation
function toggleAccordion(id) {
    const content = document.getElementById(`accordion-${id}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.accordion-icon');
    
    // Close other accordions
    document.querySelectorAll('.accordion-content.open').forEach(openContent => {
        if (openContent !== content) {
            openContent.classList.remove('open');
            openContent.previousElementSibling.classList.remove('active');
            const otherIcon = openContent.previousElementSibling.querySelector('.accordion-icon');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current
    content.classList.toggle('open');
    header.classList.toggle('active');
    icon.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
}

// Select element from list
function selectElement(type, index, selector) {
    // Remove previous selection
    document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    const clickedCard = event.currentTarget;
    clickedCard.classList.add('selected');

    // Show element info
    const elementInfo = document.getElementById('selectedElementInfo');
    const elementDetails = document.getElementById('elementDetails');
    
    elementInfo.classList.remove('hidden');
    elementDetails.innerHTML = `
        <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-white rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Type</p>
                <p class="font-semibold text-gray-800 capitalize">${type}</p>
            </div>
            <div class="p-3 bg-white rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Index</p>
                <p class="font-semibold text-gray-800">#${index}</p>
            </div>
        </div>
        <div class="mt-3 p-3 bg-white rounded-lg">
            <p class="text-xs text-gray-500 mb-1">CSS Selector</p>
            <code class="text-sm text-blue-600 break-all">${selector}</code>
        </div>
    `;

    selectedElement = { type, index, selector };
    
    // Scroll to element info
    elementInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle element selection from visual preview
function handleElementSelection(data) {
    const elementInfo = document.getElementById('selectedElementInfo');
    const elementDetails = document.getElementById('elementDetails');
    
    elementInfo.classList.remove('hidden');
    elementDetails.innerHTML = `
        <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-white rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Tag</p>
                <p class="font-semibold text-gray-800 uppercase">${data.tag || 'Unknown'}</p>
            </div>
            <div class="p-3 bg-white rounded-lg">
                <p class="text-xs text-gray-500 mb-1">ID</p>
                <p class="font-semibold text-gray-800">${data.id || '<em>None</em>'}</p>
            </div>
        </div>
        <div class="mt-3 p-3 bg-white rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Class</p>
            <code class="text-sm text-purple-600">${data.className || '<em>None</em>'}</code>
        </div>
        <div class="mt-3 p-3 bg-white rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Text Content</p>
            <p class="text-sm text-gray-700">${data.text || '<em>No text</em>'}</p>
        </div>
    `;

    selectedElement = data;
}

// Clear selection
function clearSelection() {
    document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.getElementById('selectedElementInfo').classList.add('hidden');
    selectedElement = null;
}

// Create rule from selection
function createRuleFromSelection() {
    if (!selectedElement) {
        showToast('Please select an element first', 'warning');
        return;
    }

    let selector = '';
    let selectorType = 'css';

    if (selectedElement.selector) {
        selector = selectedElement.selector;
    } else if (selectedElement.id) {
        selector = `#${selectedElement.id}`;
    } else if (selectedElement.className) {
        const firstClass = selectedElement.className.split(' ')[0];
        selector = `.${firstClass}`;
    } else if (selectedElement.tag) {
        selector = selectedElement.tag.toLowerCase();
        selectorType = 'tag';
    }

    document.getElementById('selectorValue').value = selector;
    document.getElementById('selectorType').value = selectorType;
    updateSelectorHelp();
    showAddRuleModal();
}

// Load preview in iframe
async function loadPreview() {
    if (!currentSessionId) return;

    const frame = document.getElementById('previewFrame');
    const noPreview = document.getElementById('noPreview');
    const previewError = document.getElementById('previewError');
    
    // Hide error state
    if (previewError) previewError.classList.add('hidden');

    try {
        const response = await fetch('/api/preview_html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: currentSessionId })
        });

        const data = await response.json();

        if (data.success) {
            noPreview.classList.add('hidden');
            frame.classList.remove('hidden');
            
            // Set up error handling for iframe
            frame.onload = function() {
                console.log('Preview loaded successfully');
            };
            
            frame.onerror = function() {
                console.error('Preview frame error');
                showPreviewError();
            };
            
            frame.srcdoc = data.html;
            
            // Timeout to detect if page fails to load
            setTimeout(() => {
                try {
                    // Try to access iframe content - will fail if there's an error
                    const iframeDoc = frame.contentDocument || frame.contentWindow.document;
                    if (iframeDoc && iframeDoc.readyState === 'complete') {
                        console.log('Preview fully loaded');
                    }
                } catch (e) {
                    // Can't access iframe - likely a security error
                    console.log('Cannot access iframe content (expected for some sites)');
                }
            }, 5000);
        }
    } catch (error) {
        console.error('Error loading preview:', error);
        showPreviewError();
    }
}

// Show preview error state
function showPreviewError() {
    const frame = document.getElementById('previewFrame');
    const noPreview = document.getElementById('noPreview');
    const previewError = document.getElementById('previewError');
    
    if (frame) frame.classList.add('hidden');
    if (noPreview) noPreview.classList.add('hidden');
    if (previewError) previewError.classList.remove('hidden');
    
    console.log('Showing preview error message');
}

// Refresh preview
function refreshPreview() {
    const frame = document.getElementById('previewFrame');
    const previewError = document.getElementById('previewError');
    
    // Hide error if present
    if (previewError) previewError.classList.add('hidden');
    
    frame.style.opacity = '0.5';

    setTimeout(() => {
        loadPreview();
        setTimeout(() => {
            frame.style.opacity = '1';
        }, 200);
    }, 300);

    showToast('Preview refreshed', 'info');
}

// Show add rule modal with animation
function showAddRuleModal() {
    const modal = document.getElementById('addRuleModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('ruleName').focus();
    }, 300);
}

// Close add rule modal
function closeAddRuleModal() {
    const modal = document.getElementById('addRuleModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

    // Clear inputs
    document.getElementById('ruleName').value = '';
    document.getElementById('selectorValue').value = '';
}

// Update selector help text
function updateSelectorHelp() {
    const type = document.getElementById('selectorType').value;
    const examples = {
        css: {
            text: 'Enter a CSS selector (e.g., .class-name, #element-id, tag[attr])',
            examples: ['.product-title', '#main-content', 'a[href^="https"]']
        },
        xpath: {
            text: 'Enter an XPath expression (e.g., //div[@class="item"])',
            examples: ['//div[@class="product"]', '//a[contains(@href, "shop")]']
        },
        tag: {
            text: 'Enter a tag name (e.g., h1, p, a, div)',
            examples: ['h1', 'p', 'a', 'div']
        },
        class: {
            text: 'Enter a class name (without the dot)',
            examples: ['product-title', 'container', 'btn-primary']
        },
        id: {
            text: 'Enter an ID (without the hash)',
            examples: ['main-content', 'header', 'footer']
        }
    };

    const help = examples[type];
    document.getElementById('selectorHelp').innerHTML = `
        <i class="fas fa-info-circle mr-1"></i>${help.text}
        <div class="mt-2 flex gap-2 flex-wrap">
            ${help.examples.map(ex => `<code class="bg-white px-2 py-1 rounded text-xs">${ex}</code>`).join('')}
        </div>
    `;
}

// Save extraction rule
async function saveRule() {
    const name = document.getElementById('ruleName').value.trim();
    const selectorType = document.getElementById('selectorType').value;
    const selector = document.getElementById('selectorValue').value.trim();
    const attribute = document.getElementById('extractAttribute').value;

    if (!name) {
        showToast('Please enter a rule name', 'warning');
        document.getElementById('ruleName').focus();
        return;
    }

    if (!selector) {
        showToast('Please enter a selector', 'warning');
        document.getElementById('selectorValue').focus();
        return;
    }

    const rule = {
        name,
        selector_type: selectorType,
        selector,
        attribute
    };

    try {
        const response = await fetch('/api/save_rule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule)
        });

        const data = await response.json();

        if (data.success) {
            extractionRules.push({ ...rule, id: data.rule_id });
            renderRules();
            loadSavedRules();
            closeAddRuleModal();
            showToast('Rule saved successfully!', 'success');
            updateStepIndicator(3);
        }
    } catch (error) {
        showToast('Error saving rule: ' + error.message, 'error');
    }
}

// Render extraction rules
function renderRules() {
    const container = document.getElementById('rulesContainer');

    if (extractionRules.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <i class="fas fa-filter text-4xl text-gray-300"></i>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">No Extraction Rules</h4>
                <p class="text-gray-500">Create rules to define what data you want to extract</p>
            </div>
        `;
        return;
    }

    container.innerHTML = extractionRules.map((rule, index) => `
        <div class="card mb-4">
            <div class="card-body">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                ${index + 1}
                            </div>
                            <h4 class="font-bold text-gray-800">${rule.name}</h4>
                        </div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="badge badge-primary">${rule.selector_type.toUpperCase()}</span>
                            <code class="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">${rule.selector}</code>
                        </div>
                        <p class="text-xs text-gray-500">
                            <i class="fas fa-database mr-1"></i>Extract: <span class="font-medium text-gray-700">${rule.attribute}</span>
                        </p>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <button onclick="runRule('${rule.id}')" class="btn btn-success btn-sm" title="Run Rule">
                            <i class="fas fa-play"></i>
                        </button>
                        <button onclick="deleteRule('${rule.id}')" class="btn btn-secondary btn-sm text-red-500 hover:bg-red-50" title="Delete Rule">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load saved rules from server
async function loadSavedRules() {
    try {
        const response = await fetch('/api/get_rules');
        const data = await response.json();

        if (data.success) {
            extractionRules = data.rules;
            renderRules();

            // Update sidebar
            const sidebarList = document.getElementById('savedRulesList');
            if (extractionRules.length === 0) {
                sidebarList.innerHTML = '<p class="text-sm text-gray-500 italic">No saved rules</p>';
            } else {
                sidebarList.innerHTML = extractionRules.map(rule => `
                    <div class="p-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition cursor-pointer" onclick="switchTab('extraction')">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-filter text-blue-500 text-sm"></i>
                            <div class="flex-1 min-w-0">
                                <span class="font-medium text-sm text-gray-800 block truncate">${rule.name}</span>
                                <code class="text-xs text-gray-500 block truncate">${rule.selector}</code>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading rules:', error);
    }
}

// Run single extraction rule
async function runRule(ruleId) {
    if (!currentSessionId) {
        showToast('Please scrape a website first', 'warning');
        updateStepIndicator(1);
        return;
    }

    const rule = extractionRules.find(r => r.id === ruleId);
    if (!rule) return;

    // Show loading state
    const runBtn = event.currentTarget;
    const originalContent = runBtn.innerHTML;
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/api/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: currentSessionId,
                rule: {
                    selector_type: rule.selector_type,
                    selector: rule.selector,
                    attribute: rule.attribute
                }
            })
        });

        const data = await response.json();

        if (data.success) {
            extractionResults[rule.name] = data.results;
            renderResults();
            switchTab('results');
            updateStepIndicator(4);
            showToast(`Extracted ${data.count} item${data.count !== 1 ? 's' : ''}!`, 'success');
        }
    } catch (error) {
        showToast('Error running rule: ' + error.message, 'error');
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = originalContent;
    }
}

// Run all extraction rules
async function runAllRules() {
    if (!currentSessionId) {
        showToast('Please scrape a website first', 'warning');
        updateStepIndicator(1);
        return;
    }

    if (extractionRules.length === 0) {
        showToast('No rules to run', 'warning');
        return;
    }

    // Show loading state on button
    const runAllBtn = event.currentTarget;
    const originalContent = runAllBtn.innerHTML;
    runAllBtn.disabled = true;
    runAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Running...</span>';

    try {
        const response = await fetch('/api/batch_extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: currentSessionId,
                rules: extractionRules.map(r => ({
                    name: r.name,
                    selector_type: r.selector_type,
                    selector: r.selector,
                    attribute: r.attribute
                }))
            })
        });

        const data = await response.json();

        if (data.success) {
            extractionResults = data.results;
            renderResults();
            switchTab('results');
            updateStepIndicator(4);
            
            const totalItems = Object.values(extractionResults).reduce((sum, arr) => sum + arr.length, 0);
            showToast(`All rules executed! Extracted ${totalItems} total item${totalItems !== 1 ? 's' : ''}`, 'success');
        }
    } catch (error) {
        showToast('Error running rules: ' + error.message, 'error');
    } finally {
        setTimeout(() => {
            runAllBtn.disabled = false;
            runAllBtn.innerHTML = originalContent;
        }, 500);
    }
}

// Delete extraction rule
async function deleteRule(ruleId) {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
        const response = await fetch(`/api/delete_rule/${ruleId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            extractionRules = extractionRules.filter(r => r.id !== ruleId);
            renderRules();
            loadSavedRules();
            showToast('Rule deleted', 'success');
        }
    } catch (error) {
        showToast('Error deleting rule', 'error');
    }
}

// Render extraction results
function renderResults() {
    const container = document.getElementById('resultsContainer');

    if (Object.keys(extractionResults).length === 0) {
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <i class="fas fa-table text-4xl text-gray-300"></i>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">No Results Yet</h4>
                <p class="text-gray-500">Run extraction rules to see extracted data here</p>
            </div>
        `;
        return;
    }

    let html = '';
    let totalResults = 0;
    
    for (const [ruleName, results] of Object.entries(extractionResults)) {
        totalResults += results.length;
        
        html += `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            ${results.length}
                        </div>
                        <h4 class="font-bold text-gray-800">${ruleName}</h4>
                    </div>
                    <span class="badge badge-primary">${results.length} item${results.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${results.map((result, i) => `
                        <div class="result-card">
                            <div class="flex items-start gap-3">
                                <span class="text-xs text-gray-400 font-mono mt-1">#${i + 1}</span>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-800">${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Add summary at top
    html = `
        <div class="mb-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                <div>
                    <p class="font-bold text-green-800">Extraction Complete</p>
                    <p class="text-sm text-green-600">${Object.keys(extractionResults).length} rule${Object.keys(extractionResults).length !== 1 ? 's' : ''} executed • ${totalResults} total item${totalResults !== 1 ? 's' : ''} extracted</p>
                </div>
            </div>
        </div>
    ` + html;

    container.innerHTML = html;
}

// Quick extract common elements
async function quickExtract(type) {
    if (!currentSessionId) {
        showToast('Please scrape a website first', 'warning');
        updateStepIndicator(1);
        return;
    }

    const rules = {
        headings: { selector_type: 'tag', selector: 'h1,h2,h3,h4,h5,h6', attribute: 'text' },
        links: { selector_type: 'tag', selector: 'a', attribute: 'href' },
        images: { selector_type: 'tag', selector: 'img', attribute: 'src' },
        paragraphs: { selector_type: 'tag', selector: 'p', attribute: 'text' },
        tables: { selector_type: 'tag', selector: 'table', attribute: 'html' }
    };

    const rule = rules[type];
    const labels = {
        headings: 'Headings',
        links: 'Links',
        images: 'Images',
        paragraphs: 'Paragraphs',
        tables: 'Tables'
    };

    // Show loading feedback
    showToast(`Extracting ${labels[type]}...`, 'info', 1000);

    try {
        const response = await fetch('/api/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: currentSessionId,
                rule: rule
            })
        });

        const data = await response.json();

        if (data.success) {
            extractionResults[type] = data.results;
            renderResults();
            switchTab('results');
            updateStepIndicator(4);
            showToast(`Extracted ${data.count} ${labels[type].toLowerCase()}`, 'success');
        }
    } catch (error) {
        showToast('Error extracting: ' + error.message, 'error');
    }
}

// Copy HTML to clipboard
function copyHtml() {
    if (!currentSessionId) {
        showToast('No HTML to copy', 'warning');
        return;
    }
    
    // Get full HTML from currentHtml or fetch it
    const html = currentHtml;
    
    if (!html) {
        showToast('No HTML available', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(html).then(() => {
        showToast('Full HTML copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy (HTML too large)', 'error');
    });
}

// Download HTML file
async function downloadHtml() {
    if (!currentSessionId) {
        showToast('No page to download', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/download_html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: currentSessionId })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scraped_page_${new Date().getTime()}.html`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Full HTML downloaded!', 'success');
        } else {
            showToast('Failed to download', 'error');
        }
    } catch (error) {
        showToast('Error downloading: ' + error.message, 'error');
    }
}

// Export results to file
async function exportResults(format) {
    if (Object.keys(extractionResults).length === 0) {
        showToast('No results to export', 'warning');
        return;
    }

    // Flatten results for export - keep objects as-is for backend to handle
    const flatResults = [];
    for (const [ruleName, results] of Object.entries(extractionResults)) {
        results.forEach((result, index) => {
            flatResults.push({
                rule: ruleName,
                index: index + 1,
                value: result  // Pass raw value (can be string, object, or array)
            });
        });
    }

    try {
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                format,
                data: flatResults
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracted_data_${new Date().getTime()}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`Results exported as ${format.toUpperCase()}!`, 'success');
        } else {
            const errorData = await response.json();
            showToast('Export failed: ' + (errorData.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        showToast('Error exporting: ' + error.message, 'error');
    }
}

// Show help modal
function showHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Close help modal
function closeHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to scrape
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        scrapeUrl();
    }

    // Ctrl/Cmd + S to save rule (when modal is open)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const modal = document.getElementById('addRuleModal');
        if (modal.classList.contains('active')) {
            e.preventDefault();
            saveRule();
        }
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        closeAddRuleModal();
        closeHelp();
    }
});

// Handle visibility change (pause animations when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.style.opacity = '0.99';
    } else {
        document.body.style.opacity = '1';
    }
});
