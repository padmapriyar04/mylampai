"use server";
import textClient from "@/lib/text-to-speech";

export async function synthesizeTTS(text: string) {
  try {
    if (!text)
      return {
        status: "failed",
        message: "text is required",
      };

    const request = {
      input: { text },
      voice: {
        languageCode: "en-IN",
        ssmlGender: "FEMALE" as const,
        name: "en-IN-Journey-F",
      },
      audioConfig: { audioEncoding: "MP3" as const },
    };

    const [response] = await textClient.synthesizeSpeech(request);

    return {
      audioResponse: response.audioContent,
      status: "success",
    };
  } catch (error) {
    console.log("error: ", error);
  }

  return {
    status: "failed",
    message: "Internal Server Error",
  };
}
