/////////////////////////
// Convert any language to english
/////////////////////////

const { Translate } = require('@google-cloud/translate').v2;

// Set the path to your service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'keys/agri-voice-9cc77eaf7d98.json';

// Creates a client
const translate = new Translate();

async function translateText(text, targetLanguage) {
  try {
    // Translates the text into the target language
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    return null;
  }
}

module.exports = translateText;
