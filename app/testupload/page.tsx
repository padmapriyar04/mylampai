"use client"
import React, { useState } from 'react';
import { handleAudioTranscribe } from '@/actions/transcribeAudioAction';

export default function AudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files)
    setFile(event.target.files?.[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setStatus("Please select an audio file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    setStatus("Transcribing...");
    
    try {
      const response = await handleAudioTranscribe(formData)

      if (response.status === "success") {
        setTranscription(response.transcript as string);
      } else {
        setStatus("Failed to transcribe audio.");
      }
      
    } catch (error) {
      setStatus("Error transcribing audio.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Upload Audio for Transcription</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload & Transcribe</button>
      </form>
      <p>Status: {status}</p>
      {transcription && (
        <div>
          <h3>Transcription</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}
