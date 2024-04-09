document.querySelectorAll('.play-response-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const text = button.dataset.text; // Get text from data attribute
        const lang = button.dataset.lang;
        const response = await fetch('/playresponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text , lang: lang})
        });

        if (response.ok) {
            var audioUrl = await response.json();
            var audio = new Audio(audioUrl);
            
            // Disable all play buttons
            document.querySelectorAll('.play-response-btn').forEach(btn => {
                btn.disabled = true;
            });

            // Play the audio
            audio.play();

            // Listen for the 'ended' event to enable buttons when audio completes
            audio.addEventListener('ended', () => {
                // Enable all play buttons
                document.querySelectorAll('.play-response-btn').forEach(btn => {
                    btn.disabled = false;
                });
            });
        } else {
            console.error('Failed to synthesize audio');
        }
    });
});
