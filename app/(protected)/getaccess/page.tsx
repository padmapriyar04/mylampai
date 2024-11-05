"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Component() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setAccessGranted(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      toast.error("Failed to access microphone and camera.");
    } 
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Your browser does not support accessing media devices");
    }
  }, []);

  if (!accessGranted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Enable Microphone and Camera</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              To use this application, we need access to your microphone and
              camera.
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              <Mic className="h-6 w-6 text-gray-400" />
              <Camera className="h-6 w-6 text-gray-400" />
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <Button
              onClick={requestAccess}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Requesting Access...
                </>
              ) : (
                "Enable Access"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Application</h1>
      <p className="text-lg text-gray-600">
        Microphone and camera access has been granted. You can now use the
        application.
      </p>
      {/* Add your main application content here */}
    </div>
  );
}
