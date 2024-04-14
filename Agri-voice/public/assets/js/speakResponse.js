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
            // Fetch the response MP3 file from the server
            fetch('/responsevoice')
            .then(response => {
                // Check if the response was successful
                if (!response.ok) {
                    throw new Error('Failed to fetch audio');
                }
                // Return the response as blob
                return response.blob();
            })
            .then(blob => {
                // Convert the blob to a Blob URL
                const audioUrl = URL.createObjectURL(blob);
                // Create an Audio object with the Blob URL
                const audio = new Audio(audioUrl);
                // Play the audio
                audio.play();
                // Disable all play buttons
                document.querySelectorAll('.play-response-btn').forEach(btn => {
                    btn.disabled = true;
                });
                // Listen for the 'ended' event to enable buttons when audio completes
                audio.addEventListener('ended', () => {
                    // Enable all play buttons
                    document.querySelectorAll('.play-response-btn').forEach(btn => {
                        btn.disabled = false;
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });

        } else {
            console.error('Failed to synthesize audio');
        }
    });
});
