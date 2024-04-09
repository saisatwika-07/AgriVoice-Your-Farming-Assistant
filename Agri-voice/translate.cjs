const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util'); // Import the util module

// Set the path to your service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'keys/agri-voice-9cc77eaf7d98.json';

// Creates a translate client
const translateClient = new Translate();

// Creates a text-to-speech client
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

async function translateText(text, targetLanguage) {
  try {
    // Translates the text into the target language
    const [translation] = await translateClient.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    return null;
  }
}

async function synthesizeText(text, languageCode, outputFile) {
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, 'binary');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function translateAndSynthesize(text, targetLanguage, outputFile) {
  try {
    // Translate the text to the target language
    const translatedText = await translateText(text, targetLanguage);
    if (!translatedText) {
      console.error('Failed to translate text.');
      return;
    }

    // Synthesize the translated text into speech
    await synthesizeText(translatedText, targetLanguage, outputFile);
    return translatedText;
  } catch (error) {
    console.error('Error translating and synthesizing text:', error);
  }
}

module.exports = { translateText, synthesizeText, translateAndSynthesize };
