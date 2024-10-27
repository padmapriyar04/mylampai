"use server"
import speechClient from "@/lib/speech-to-text"
import fs from "fs"
import ffmpeg from "fluent-ffmpeg"
import path from "path"
import { v4 as uuidv4 } from 'uuid';

async function saveFileToDisk(file: File): Promise<string> {
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

    if (!audioFile) {
      return {
        status: "failed",
        message: "Audio File Required"
      };
    }

    inputFilePath = await saveFileToDisk(audioFile);
    monoFilePath = await convertToMonoMP3(inputFilePath);

    const audioBuffer = fs.readFileSync(monoFilePath);
    const audioContent = audioBuffer.toString('base64');

    const audio = { content: audioContent };
    const config = {
      encoding: 'MP3' as const,
      sampleRateHertz: 12000,
      languageCode: 'en-IN',
    };

    const request = { audio, config };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    console.log("transcription: ", transcription);
    if (inputFilePath && fs.existsSync(inputFilePath)) {
      fs.unlinkSync(inputFilePath);
    }
    if (monoFilePath && fs.existsSync(monoFilePath)) {
      fs.unlinkSync(monoFilePath);
    }
    return {
      status: "success",
      transcript: transcription
    };

  } catch (error) {
    console.log(error);
    return { status: "failed" };
  } 
}
