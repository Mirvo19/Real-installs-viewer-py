// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');
    const preloader = document.getElementById('preloader');

    // Initialize animations when the page loads
    function initAnimations() {
        // Animate main sections and their key children from bottom up, with stagger
        const mainFlex = document.querySelector('body > div');
        if (!mainFlex) return;
        // Collect all animatable elements in bottom-up order
        let animEls = [];
        // Footer (bottom)
        const footer = mainFlex.querySelector('footer');
        if (footer) animEls.push(footer);
        // Main children (form, result, copy button)
        const main = mainFlex.querySelector('main');
        if (main) {
            // Add main, then its children (form, result, copy button)
            animEls.push(main);
            // Animate form fields and result area
            const form = main.querySelector('form');
            if (form) {
                animEls = animEls.concat(Array.from(form.children));
            }
            const resultArea = main.querySelector('#result');
            if (resultArea) animEls.push(resultArea);
            const copyBtn = main.querySelector('#copy-btn');
            if (copyBtn) animEls.push(copyBtn);
        }
        // Header (top)
        const header = mainFlex.querySelector('header');
        if (header) animEls.push(header);

        // Remove duplicates and nulls
        animEls = animEls.filter((el, idx, arr) => el && arr.indexOf(el) === idx);
        // Add fade-bottom and hide
        animEls.forEach(el => {
            el.classList.add('fade-bottom');
            el.style.visibility = 'hidden';
        });
        // Animate bottom-up (footer first, header last)
        setTimeout(() => {
            animEls.forEach((el, idx) => {
                setTimeout(() => {
                    el.style.visibility = 'visible';
                    el.classList.add('visible');
                }, idx * 120);
            });
        }, 120);
    }

    // Handle search form submission
    async function handleSearch(e) {
        e.preventDefault();
        const appName = searchInput.value.trim();
        
        if (!appName) {
            showResult('Please enter an app name.', 'error');
            return;
        }

        showLoading();
        
        try {
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ app_name: appName })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            displayResult(data);
        } catch (error) {
            showResult(`Error: ${error.message}`, 'error');
        }
    }

    // Show loading state
    function showLoading() {
        resultDiv.innerHTML = '<div class="loader"></div>';
        resultDiv.className = 'result';
        copyBtn.style.opacity = '0';
        copyBtn.style.pointerEvents = 'none';
    }

    // Show result message
    function showResult(message, type = 'info') {
        resultDiv.className = `result ${type}`;
        resultDiv.innerHTML = `<p>${message}</p>`;
        copyBtn.style.opacity = '0';
        copyBtn.style.pointerEvents = 'none';
    }

    // Display search results
    function displayResult(data) {
        let html = `
            <h2>${escapeHtml(data.title)}</h2>
            <div class="app-meta">
                <p><strong>Developer:</strong> ${escapeHtml(data.developer)}</p>
                <p><strong>Installs:</strong> ${formatNumber(data.installs)}</p>
        `;
        
        if (data.realInstalls) {
            html += `<p><strong>Real Installs:</strong> ${formatNumber(data.realInstalls)}</p>`;
        }
        
        html += `
                <p><strong>Score:</strong> ${data.score} (${formatNumber(data.ratings)} ratings)</p>
            </div>
        `;
        
        resultDiv.innerHTML = html;
        resultDiv.classList.add('installs-animated');
        
        // Show copy button with animation
        setTimeout(() => {
            copyBtn.style.opacity = '1';
            copyBtn.style.pointerEvents = 'auto';
        }, 300);
    }

    // Copy results to clipboard
    function copyToClipboard() {
        const textToCopy = resultDiv.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Helper function to format numbers with commas
    function formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Event listeners
    searchForm.addEventListener('submit', handleSearch);
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        clearBtn.classList.add('hidden');
        showResult('Enter an app name to get started.');
    });
    
    searchInput.addEventListener('input', () => {
        clearBtn.classList.toggle('hidden', !searchInput.value);
    });
    
    copyBtn.addEventListener('click', copyToClipboard);

    // Initialize the page
    function init() {
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        // Hide preloader and show content, then animate
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.visibility = 'visible';
                document.body.style.opacity = '1';
                if (preloader) {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                }
                // Animate bottom-up fade-in
                initAnimations();
                // Focus the search input
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        });
    }

    // Start the initialization
    init();
});

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('search-form').dispatchEvent(new Event('submit'));
    }
});
