"use server";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import speech from "@google-cloud/speech";

async function saveFileToDisk(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join("./tmp", `${uuidv4()}_${file.name}`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

async function convertToMonoMP3(inputFile: string): Promise<string> {
  const outputFile = path.join(
    "./tmp",
    path.basename(inputFile, path.extname(inputFile)) + "_mono.mp3"
  );

  console.log(`Converting to mono MP3: ${inputFile} -> ${outputFile}`); 
  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputFile)
      .toFormat("mp3")
      .on("end", () => resolve(outputFile))
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        reject(err);
      })
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
        message: "Audio File Required",
      };
    }

    inputFilePath = await saveFileToDisk(audioFile);
    monoFilePath = await convertToMonoMP3(inputFilePath);

    const audioBuffer = fs.readFileSync(monoFilePath);
    const audioContent = audioBuffer.toString("base64");

    const audio = { content: audioContent };
    const config = {
      encoding: "MP3" as const,
      sampleRateHertz: 12000,
      languageCode: "en-IN",
    };

    const request = { audio, config };

    const speechClient = new speech.SpeechClient();

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0].transcript)
      .join("\n");

    console.log("transcription: ", transcription);

    return {
      status: "success",
      transcript: transcription,
    };
  } catch (error) {
    console.log(error);
    return { status: "failed" };
  } finally {
    // if (inputFilePath && fs.existsSync(inputFilePath)) {
    //   fs.unlinkSync(inputFilePath);
    // }
    // if (monoFilePath && fs.existsSync(monoFilePath)) {
    //   fs.unlinkSync(monoFilePath);
    // }
  }
}

// const transcribeAudio = async (audioFilePath: string) => {
//   const client = new speech.SpeechClient();

//   // Convert audio file to a format that Google Speech API accepts (e.g., WAV)
//   const convertedAudioPath = "converted_audio.wav";
//   await new Promise((resolve, reject) => {
//     ffmpeg(audioFilePath)
//       .toFormat("wav")
//       .save(convertedAudioPath)
//       .on("end", resolve)
//       .on("error", reject);
//   });

//   // Load the converted audio file
//   const file = fs.readFileSync(convertedAudioPath);
//   const audioBytes = file.toString("base64");

//   // Configure request
//   const request = {
//     audio: { content: audioBytes },
//     config: {
//       encoding: "LINEAR16" as const,
//       sampleRateHertz: 44100,
//       languageCode: "en-US",
//     },
//   };

//   const [response] = await client.recognize(request);
//   const transcription = response.results
//     ?.map((result) => result.alternatives?.[0].transcript)
//     .join("\n");

//   console.log("Transcription:", transcription);
//   return transcription;
// };

// export async function handleLiveAudioTranscribe(formData: FormData) {
//   let inputFilePath: string | null = null;

//   try {
//     const audioFile = formData.get("audio") as File;

//     if (!audioFile) return "";

//     inputFilePath = await saveFileToDisk(audioFile);

//     const transcription = await transcribeAudio(inputFilePath);
//     console.log(transcription);
//     return transcription;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     if (inputFilePath && fs.existsSync(inputFilePath)) {
//       fs.unlinkSync(inputFilePath);
//     }
//   }

//   return "";
// }
