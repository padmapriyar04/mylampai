"use client";
import React, { useState, useEffect, useRef } from "react";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, StopCircle, Upload } from "lucide-react";

const containerName = "company-logos";
const storageAccountName = "recruits0mylampai";
const sasToken = "sp=rw&st=2024-10-27T23:50:36Z&se=2024-10-28T07:50:36Z&sv=2022-11-02&sr=c&sig=U9PRayERGT%2FWGIGxnFruX1piN2CaUDuwZHnnUuBW59g%3D";

const RealTimeVideoUploader: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Type references with appropriate types
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const blobClient = useRef<BlockBlobClient | null>(null);
  const audioBlobClient = useRef<BlockBlobClient | null>(null);

  useEffect(() => {
    const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const timestamp = Date.now();

    // Set up separate Blob Clients for video and audio
    blobClient.current = containerClient.getBlockBlobClient(`interview-${timestamp}.webm`);
    audioBlobClient.current = containerClient.getBlockBlobClient(`interview-audio-${timestamp}.webm`);
  }, []);

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioRecorderRef.current) audioRecorderRef.current.stop();
    setIsRecording(false);
  };
  
  const uploadChunk = async (client: BlockBlobClient | null, chunk: Blob, blockIndex: number) => {
    try {
      if (client) {
        const blockId = btoa(String(blockIndex).padStart(6, '0'));  // Padded, consistent ID
        await client.stageBlock(blockId, chunk, chunk.size);
        console.log(`Uploaded block: ${blockId}`);
      }
    } catch (error) {
      console.error("Error uploading chunk:", error);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
  
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const audioStream = new MediaStream(stream.getAudioTracks());
      const audioRecorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
  
      let videoBlockIndex = 0;
      let audioBlockIndex = 0;
  
      mediaRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          await uploadChunk(blobClient.current, event.data, videoBlockIndex++);
        }
      };
  
      audioRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          await uploadChunk(audioBlobClient.current, event.data, audioBlockIndex++);
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
      const videoBlockList = chunksRef.current.map((_, index) =>
        btoa(String(index).padStart(6, '0'))
      );
      const audioBlockList = audioChunksRef.current.map((_, index) =>
        btoa(String(index).padStart(6, '0'))
      );
  
      if (blobClient.current) {
        await blobClient.current.commitBlockList(videoBlockList);
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
        <CardTitle className="text-2xl font-bold">Real-Time Video and Audio Recording</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" aria-label="Video preview" />
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
        <Button onClick={finalizeUpload} disabled={!chunksRef.current.length} className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Finalize Upload
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RealTimeVideoUploader;
