
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    const form = document.getElementById('suggestionForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');


    // Always hide success and error messages on page load
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const suggestion = document.getElementById('suggestion').value;
        const category = document.getElementById('category').value;
        if (!suggestion) {
            showError("Please enter your suggestion");
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        try {
            const timestamp = new Date().toLocaleString();
            // Add a random emoji for fun
            const emojis = ['✨','🔥','🎉','💡','🦩','🌸','🚀','😎','👍','🥳'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const embed = {
                title: `${randomEmoji} New Suggestion!`,
                color: 0xff69b4,
                author: {
                    name: name ? name : 'Anonymous',
                    icon_url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                },
                thumbnail: {
                    url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                },
                description: `**Category:** ${category.charAt(0).toUpperCase() + category.slice(1)}\n**Submitted At:** ${timestamp}`,
                fields: [
                    { name: 'Suggestion', value: suggestion }
                ],
                footer: {
                    text: 'Real Installs Viewer Suggestion',
                    icon_url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                }
            };
            // Animate submit button
            submitBtn.style.transform = 'scale(0.95)';
            submitBtn.style.background = 'var(--flamingo-pink-dark)';
            setTimeout(() => {
                submitBtn.style.transform = '';
                submitBtn.style.background = '';
            }, 300);
            // Send to backend endpoint to avoid CORS
            const response = await fetch('/send-suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embed }),
            });
            if (response.ok) {
                form.reset();
                successMessage.classList.remove('hidden');
                successMessage.classList.add('show');
                errorMessage.classList.add('hidden');
                errorMessage.classList.remove('show');
            } else {
                throw new Error('Failed to send suggestion');
            }
        } catch (error) {
            console.error('Error:', error);
            showError("Failed to send suggestion. Please try again later.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Suggestion';
        }
    });
    function showError(message) {
    document.getElementById('errorText').textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('show');
    successMessage.classList.add('hidden');
    successMessage.classList.remove('show');
    }
});
