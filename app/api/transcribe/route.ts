import { NextRequest, NextResponse } from "next/server";
import speechClient from "@/lib/speech-to-text";

export async function POST(req: NextRequest) {
  try {

    const { content } = await req.json();

    if (!content)
      return NextResponse.json({
        message: "Content is required"
      }, { status: 404 })

    const config = {
      encoding: "LINEAR16" as "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-IN",
      enableAutomaticPunctuation: true
    }

    const audio = {
      content
    }

    const request = {
      config,
      audio
    }

    const [response] = await speechClient.recognize(request);

    const transcription = response.results?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    console.log("transcription ", transcription)

    return NextResponse.json({
      transcript: transcription
    }, { status: 200 });

  } catch (error) {
    console.log("error: ", error);

    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 })
  }
}


export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
