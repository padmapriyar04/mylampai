"use server"
import speechClient from "@/lib/speech-to-text"
import fs from "fs/promises"

export async function handleAudioTranscribe(formData: FormData) {
  try {
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    const audioFile = formData.get("audio") 
    const textContent = formData.get("text")

    console.log("formData: ", formData)

    console.log("textContent", textContent)

    if (!audioFile) {
      return {
        status: "failed",
        message: "Audio File Required"
      }
    }

    const audio = {
      uri: gcsUri
    };

    const config = {
      encoding: 'LINEAR16' as "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: 'en-IN',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);

    const transcription = response.results?.map(result => result.alternatives?.[0].transcript).join('\n');

    console.log("transcription: ", transcription)

    return {
      status: "success",
      transcript: transcription
    }
  } catch (error) {
    console.log(error)
  }
  return {
    status: "failed"
  }
}