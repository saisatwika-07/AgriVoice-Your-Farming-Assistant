const axios = require('axios');
async function getOpenAiResponse(prompt){
    // Data to be sent in the POST request (in JSON format)
    const postData = {
        "model": "gpt-3.5-turbo",
        "messages": [
        {
            "role": "system",
            "content": "You are a helpful agriculture based assistant, how answers farmers daily queries."
        },
        {
            "role": "user",
            "content": prompt
        }
        ]
    }

    // Configuring the request headers
    const headers = {
    'Authorization': 'Bearer ' // Example of an authorization header
    };

    // HTTPS endpoint URL
    const url = 'https://api.openai.com/v1/chat/completions';

    // Making the POST request using Axios
    axios.post(url, postData, { headers })
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

module.exports = getOpenAiResponse;