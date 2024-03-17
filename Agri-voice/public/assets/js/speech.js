const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const userInput = document.getElementById('userInput');

let recognition;
let isSpeaking = false;
let stopTimeout;
let currentTranscription = '';

var langCode = document.getElementById("language").value;

startRecordButton.addEventListener('click', () => {
    startRecording();
});

stopRecordButton.addEventListener('click', () => {
    stopRecording();
});

function startRecording() {
    recognition = new window.webkitSpeechRecognition();
    langCode = document.getElementById("language").value;
    userInput.placeholder = "Listening";
    recognition.lang = langCode;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    recognition.onstart = () => {
        console.log('Recording started...');
        startRecordButton.disabled = true;
        stopRecordButton.disabled = false;
    };

    recognition.onresult = (event) => {
        let interimTranscription = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                currentTranscription += event.results[i][0].transcript;
            } else {
                interimTranscription += event.results[i][0].transcript;
            }
        }
        userInput.value = currentTranscription + interimTranscription;
        resetStopTimeout();
    };

    recognition.onend = () => {
        console.log('Recording stopped.');
        if (!isSpeaking) {
            startStopTimeout();
        }
    };
}

function resetStopTimeout() {
    clearTimeout(stopTimeout);
    startStopTimeout();
}

function startStopTimeout() {
    stopTimeout = setTimeout(() => {
        if (!isSpeaking) {
            stopRecording();
        }
    }, 5000); // Wait for 5 seconds before stopping recording
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
        userInput.placeholder = "Your Question Goes Here";
    }
    clearTimeout(stopTimeout);
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
}

recognition.onstart = () => {
    setSpeakingStatus(true);
};

recognition.onspeechend = () => {
    setSpeakingStatus(false);
};

recognition.onend = () => {
    setSpeakingStatus(false);
};

function setSpeakingStatus(status) {
    isSpeaking = status;
}
