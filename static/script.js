async function searchApp() {
    const appName = document.getElementById('search-input').value.trim();
    if (!appName) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<p class="error">Please enter an app name.</p>`;
        return;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loader"></div>';

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
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }
        let html = `
            <h2>${data.title}</h2>
            <div class="app-meta">
                <p><strong>Developer:</strong> ${data.developer}</p>
                <p><strong>Installs:</strong> ${data.installs}</p>
        `;
        if (data.realInstalls) {
            html += `<p><strong>Real Installs:</strong> ${data.realInstalls.toLocaleString()}</p>`;
        }
        html += `
                <p><strong>Score:</strong> ${data.score} (${data.ratings.toLocaleString()} ratings)</p>
            </div>
        `;
        resultDiv.innerHTML = html;
        document.getElementById('copy-btn').style.display = 'block';

    } catch (error) {
        resultDiv.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
        document.getElementById('copy-btn').style.display = 'none';
    }
}

function clearSearch() {
    document.getElementById('search-input').value = '';
}

function copyResults() {
    const resultDiv = document.getElementById('result');
    const textToCopy = resultDiv.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Results copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy results.');
    });
}

function toggleTheme() {
    const body = document.body;
    const themeSwitcher = document.querySelector('.theme-switcher');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeSwitcher.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeSwitcher.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-switcher').textContent = '☀️';
    }
});

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchApp();
    }
});
