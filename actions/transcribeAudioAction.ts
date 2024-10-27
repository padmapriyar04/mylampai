"use server"
import speechClient from "@/lib/speech-to-text"
import fs from "fs"
import ffmpeg from "fluent-ffmpeg"
import path from "path"
import { v4 as uuidv4 } from 'uuid';

async function saveFileToDisk(file: File): Promise<string> {
  console.log("In save file")
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join("/tmp", `${uuidv4()}_${file.name}`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

async function convertToMonoMP3(inputFile: string): Promise<string> {
  const outputFile = path.join("/tmp", path.basename(inputFile, path.extname(inputFile)) + '_mono.mp3');

  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputFile)
      .audioChannels(1)
      .toFormat('mp3')
      .on('end', () => resolve(outputFile))
      .on('error', reject)
      .save(outputFile);
  });
}

export async function handleAudioTranscribe(formData: FormData) {
  let inputFilePath: string | null = null;
  let monoFilePath: string | null = null;

  try {
    const audioFile = formData.get("audio") as File;

    console.log("formData: ", formData);
    console.log("audioFile: ", audioFile);

    if (!audioFile) {
      return {
        status: "failed",
        message: "Audio File Required"
      };
    }

    // Save and convert the file to mono MP3
    inputFilePath = await saveFileToDisk(audioFile);
    console.log("inputFilePath ", inputFilePath)
    monoFilePath = await convertToMonoMP3(inputFilePath);
    console.log("monoFilePath ", monoFilePath)

    // Read and encode the file to Base64
    const audioBuffer = fs.readFileSync(monoFilePath);
    const audioContent = audioBuffer.toString('base64');

    const audio = { content: audioContent };
    const config = {
      encoding: 'MP3' as const,
      sampleRateHertz: 12000,
      languageCode: 'en-IN',
    };

    const request = { audio, config };

    // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    console.log("transcription: ", transcription);

    return {
      status: "success",
      transcript: transcription
    };
    
  } catch (error) {
    console.log(error);
    return { status: "failed" };
  } finally {
    if (inputFilePath && fs.existsSync(inputFilePath)) {
      fs.unlinkSync(inputFilePath);
    }
    if (monoFilePath && fs.existsSync(monoFilePath)) {
      fs.unlinkSync(monoFilePath);
    }
  }
}
