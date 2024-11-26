"use client";
import React, { useState, useEffect, useRef } from "react";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { generateSasUrlForInterview } from "@/actions/azureActions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, StopCircle, Upload } from "lucide-react";

const containerName = "mylampai-interview";

const RealTimeVideoUploader: React.FC = () => {
  const params = useParams();
  const interviewId = params.interviewId as string;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoBlobClient = useRef<BlockBlobClient | null>(null);
  const audioBlobClient = useRef<BlockBlobClient | null>(null);

  const [videoSASUrl, setVideoSASUrl] = useState<string>("");
  const [audioSASUrl, setAudioSASUrl] = useState<string>("");

  const videoBlockIds = useRef<string[]>([]);
  const audioBlockIds = useRef<string[]>([]);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {}, [interviewId]);

  useEffect(() => {
    if (videoSASUrl) {
    }
  }, [videoSASUrl, interviewId]);

  useEffect(() => {
    const generateSasUrl = async ({
      interviewId,
      timestamp,
    }: {
      interviewId: string;
      timestamp: string;
    }) => {
      const videoBlobName = `${interviewId}_${Date.now()}_v.webm`;
      const audioBlobName = `${interviewId}_${Date.now()}_a.webm`;

      const videoResponse = await generateSasUrlForInterview(videoBlobName);
      const audioResponse = await generateSasUrlForInterview(audioBlobName);

      return {
        videoSASUrl: videoResponse?.sasUrl,
        audioSASUrl: audioResponse?.sasUrl,
      };
    };

    const generateBlobSasUrls = async () => {
      const timestamp = Date.now().toString();
      const { videoSASUrl, audioSASUrl } = await generateSasUrl({
        interviewId,
        timestamp,
      });

      if (videoSASUrl && audioSASUrl) {
        console.log("videoSASUrl", videoSASUrl);
        console.log("audioSASUrl", audioSASUrl);
        const blobServiceClient = new BlobServiceClient(videoSASUrl);

        const videoContainerClient =
          blobServiceClient.getContainerClient(containerName);
        const audioContainerClient =
          blobServiceClient.getContainerClient(containerName);

        const videoBlobName = `${interviewId}_${timestamp}_v.webm`;
        videoBlobClient.current =
          videoContainerClient.getBlockBlobClient(videoBlobName);

        const audioBlobName = `${interviewId}_${timestamp}_a.webm`;
        audioBlobClient.current =
          audioContainerClient.getBlockBlobClient(audioBlobName);
      }
    };

    generateBlobSasUrls();
  }, [interviewId]);

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  //   if (audioRecorderRef.current) audioRecorderRef.current.stop();
  //   setIsRecording(false);
  // };

  const uploadChunk = async (
    client: BlockBlobClient | null,
    chunk: Blob,
    blockId: string,
  ) => {
    try {
      if (client) {
        await client.stageBlock(blockId, chunk, chunk.size);
        console.log(`Uploaded block: ${blockId}`);
      }
    } catch (error) {
      console.error("Error uploading chunk:", error);
    }
  };

  const commitBlocks = async (client: BlockBlobClient, blockIds: string[]) => {
    try {
      await client.commitBlockList(blockIds);
      console.log("Finalized blob upload.");
    } catch (error) {
      console.error("Error finalizing blob upload:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioRecorderRef.current) audioRecorderRef.current.stop();
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop()); // Clean up media stream
    setIsRecording(false);

  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      const audioStream = new MediaStream(stream.getAudioTracks());
      const audioRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });

      let videoBlockIndex = 0;
      let audioBlockIndex = 0;
      videoBlockIds.current = [];
      audioBlockIds.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const blockId = btoa(String(videoBlockIndex++).padStart(6, "0"));
          videoBlockIds.current.push(blockId);
          await uploadChunk(videoBlobClient.current, event.data, blockId);
        }
      };

      audioRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const blockId = btoa(String(audioBlockIndex++).padStart(6, "0"));
          audioBlockIds.current.push(blockId);
          await uploadChunk(audioBlobClient.current, event.data, blockId);
        }
      };

      mediaRecorder.start(3000);
      audioRecorder.start(3000);

      mediaRecorderRef.current = mediaRecorder;
      audioRecorderRef.current = audioRecorder;

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const finalizeUpload = async () => {
    try {
      const videoBlockList = videoChunksRef.current.map((_, index) =>
        btoa(String(index).padStart(6, "0")),
      );
      const audioBlockList = audioChunksRef.current.map((_, index) =>
        btoa(String(index).padStart(6, "0")),
      );

      if (videoBlobClient.current) {
        await videoBlobClient.current.commitBlockList(videoBlockList);
        console.log("Video upload complete and finalized.");
      }
      if (audioBlobClient.current) {
        await audioBlobClient.current.commitBlockList(audioBlockList);
        console.log("Audio upload complete and finalized.");
      }
    } catch (error) {
      console.error("Error finalizing upload:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Real-Time Video and Audio Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
            aria-label="Video preview"
          />
        </div>
        <div className="flex justify-center">
          {!isRecording ? (
            <Button onClick={startRecording}>
              <Video className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive">
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>
        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Upload Progress</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={finalizeUpload}
          disabled={!videoBlockIds.current.length}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Finalize Upload
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RealTimeVideoUploader;
