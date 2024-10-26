import textToSpeech from "@google-cloud/text-to-speech"

const client = new textToSpeech.TextToSpeechClient();

export default client;