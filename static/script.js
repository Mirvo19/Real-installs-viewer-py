async function searchApp() {
    const appName = document.getElementById('search-input').value.trim();
    if(!appName) return;

    const resultDiv = document.getElementById('reasult');
    resultDiv.innerHTML = '<p>Searching...</p>';

    try{
        const response = await fetch('/search',{
            method:'POST',
            headers: {
                'Content-type':'application/json',
            },
            body: JSON.stringify({app_name: appName})
        });
        const data = await response.json();
        if(data.error){
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }
        let html =`
        <h2>${data.title}</h2>
        <p><strong> Developer:</strong>${data.developer}</p>
        <p><strong> Installs:</strong>${data.installs}</p>
        `;
        if (data.realInstalls){
            html += `<p> <strong> Real Installs:</strong> ${data.realInstalls.toLocaleString()}</p>`
        }
        html += `<p><strong>Score:</strong> ${data.score} (${data.ratings.toLocaleString()} ratings)</p>`;
                resultDiv.innerHTML = html;
     
              } catch (error) {
                resultDiv.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
            }
        }
        
        

        // Allow searching with Enter key
        document.getElementById('search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchApp();
            }
        });
