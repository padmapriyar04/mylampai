"use client";
import React, {
  useState,
  useRef,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";
import DeviceSelection from "./DeviceSelection";
import { useRouterStore } from "@/utils/useRouteStore";
import InterviewPage from './InterviewPage';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { toast } from "sonner";
import { useWebSocketContext } from '@/hooks/webSocketContext';


type ChatMessage = {
  user: string;
  message: string;
};

const InterviewComponent = () => {
  const { ws } = useWebSocketContext();
  const { changeRoute } = useRouterStore();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [manualJobDescription, setManualJobDescription] = useState("");
  const [selectedJobProfile, setSelectedJobProfile] = useState("");
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundTesting, setIsSoundTesting] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isMicTestEnabled, setIsMicTestEnabled] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const [cvText, setCvText] = useState("");
  const [JD, setJD] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [audioTextInputs, setAudioTextInputs] = useState<string[]>([]);

  const [textToSpeak, setTextToSpeak] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);

  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const allDevicesConfigured =
    isCameraEnabled && isMicEnabled && isSoundEnabled;


  useEffect(() => {

    if (ws) {

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "cv_uploaded") {
          setIsUploading(false);
          toast.success("Resume uploaded successfully!");
          setCvText(data.cv_text);
        }
        else if (data.type === "jd_analyzed") {
          setJD(data.job_description);
        }
        else if (data.type === "interview_started") {
          setIsInterviewStarted(true)
        }
        else if (data.type === "interview_question") {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "Interviewer", message: data.question },
          ]);
          setTextToSpeak(data.question);
          setLoading(false);
        }
        else if (data.type === "coding_question") {

          ws.send(
            JSON.stringify({
              type: "coding",
              code: 'This is a dummy response to the coding question.',
              ques: data.message
            })
          );

        } else if (data.type === "code_evaluation") {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "System", message: "Code evaluation result: " + data.result }
          ]);


        } else if (data.type === "interview_end") {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "System", message: data.message },
          ]);
        } else if (data.type === "analysis") {
          setAnalysisData(data.result); // Store analysis data
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "Analysis", message: JSON.stringify(data.result) },
          ]);
        }
      };
    }

  }, [ws]);

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", message },
      ]);
      ws?.send(
        JSON.stringify({ type: "answer", answer: message }),
      );
    }
  };

  const handleTextSubmit = (text: string) => {
    setAudioTextInputs((prevInputs) => [...prevInputs, text]); // Store the audio-to-text input
    ws?.send(
      JSON.stringify({
        type: "answer",
        answer: text,
      }),
    );
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", message: text },
    ]);
  };

  const handleSpeak = () => {
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setIsSpeaking(true); // Set isSpeaking to true when TTS starts

    utterance.onend = () => {
      setIsSpeaking(false); // Reset isSpeaking to false when TTS ends
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (textToSpeak) {
      handleSpeak();
    }
  }, [textToSpeak]);

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    setFile: (file: File) => void,
  ) => {
    // Prevent the default behavior (Prevent file from being opened in the browser)
    event.preventDefault();

    // Get the files from the drop event
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (
        file &&
        (file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        // Update the state with the file
        setFile(file);

        // Create a custom event object with the necessary properties
        const customEvent = {
          target: { files: [file] },
          // Add necessary properties if needed (e.g., currentTarget, nativeEvent, etc.)
        } as unknown as ChangeEvent<HTMLInputElement>;

        // Call the function as if it were handling a real file input change
        handleResumeUpload(customEvent);
      } else {
        toast.success("Please upload a valid DOC, DOCX, or PDF file.");
      }
    }
  };


  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setIsUploading(true);

      setResumeFile(file);
      setCvText(file.name);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryData = e.target?.result as ArrayBuffer;
        if (binaryData && ws) {
          ws.send(
            JSON.stringify({
              type: "upload_cv",
              cv_data: Array.from(new Uint8Array(binaryData)),
            })
          );

        } else {
          console.error("WebSocket is not initialized");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.success("Please upload a valid DOC, DOCX, or PDF file.");
      setResumeFile(null);
      setCvText("");
      setIsUploading(false);
    }
  };


  const startInterview = () => {
    if (cvText && JD) {

      if (ws) {
        ws.send(
          JSON.stringify({
            type: "start_interview",
            pdf_text: cvText,
            job_description: JD,
          }),
        )
      } else {
        console.error("WebSocket is not initialized");
      }
    } else {
      console.error("CV or JD not uploaded, cannot start interview.");
    }
  };

  const handleNextClick = () => {
    if (step === 3 && allDevicesConfigured) {
      if (!cvText || !JD) {
        toast.success('Please upload both the CV and Job Description before starting the interview.');
        return;
      }
      changeRoute(false);
      startInterview();
    } else {
      setStep(step + 1);
    }
  };

  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  useEffect(() => {
    const enableCamera = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream; // No need for '!' as videoRef is typed
          videoRef.current.play(); // TypeScript now knows play() exists on HTMLVideoElement
        } catch (err) {
          if (err instanceof Error) {
            console.error("Error accessing camera:", err.message);
            toast.success("Unable to access camera: " + err.message);
          } else {
            console.error("Unknown error accessing camera");
            toast.success("Unable to access camera due to an unknown error.");
          }
        }
      }
    };

    if ((isCameraEnabled || isInterviewStarted) && videoRef.current) {
      enableCamera();
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();

        // Stop all tracks to release the camera
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraEnabled, isInterviewStarted]);


  const handleSoundConfirmation = () => {
    stopTestSound();
    setIsSoundEnabled(true);
    setIsSoundTesting(false);
  };

  const startMicrophoneTest = () => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;

    if (!AudioContext) {
      toast.success("Web Audio API is not supported in this browser");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        updateVolume();
      })
      .catch((err: unknown) => {
        console.error("Error accessing microphone:", err);
        if (err instanceof Error) {
          toast.error("Unable to access microphone: " + err.message);
        } else {
          toast.error("Unable to access microphone due to an unknown error.");
        }
      });
  };

  const updateVolume = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const volume =
        dataArrayRef.current.reduce((a, b) => a + b, 0) /
        dataArrayRef.current.length;

      setVolume(volume);
      rafIdRef.current = requestAnimationFrame(updateVolume);
    }
  };


  const stopMicrophoneTest = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null; // Reset the ref to null after canceling
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setVolume(0);
  };

  const stopTestSound = () => {
    if (audioRef.current) {
      const audioElement = audioRef.current as HTMLAudioElement; // Type assertion
      audioElement.pause();
      audioElement.currentTime = 0; // Reset the audio to the start
    }
  };

  if (isInterviewStarted) {
    return (
      <InterviewPage
        isMicEnabled={isMicEnabled}
        isSpeaking={isSpeaking}
        chatMessages={chatMessages}
        audioTextInputs={audioTextInputs}
        loading={loading}
        handleTextSubmit={handleTextSubmit}
        handleSendMessage={handleSendMessage}
        websocketRef={websocketRef}
        analysisData={analysisData}
      />
    );
  }

  return (
    <>
      {step === 1 && (
        <StepOne
          resumeFile={resumeFile}
          isUploading={isUploading}
          handleResumeUpload={handleResumeUpload}
          handleDragOver={handleDragOver}
          handleDrop={(e) => handleDrop(e, setResumeFile)}
          handleNextClick={handleNextClick}
          setResumeFile={setResumeFile}
        />
      )}

      {step === 2 && (
        <StepTwo
          manualJobDescription={manualJobDescription}
          selectedJobProfile={selectedJobProfile}
          setJD={setJD}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          setSelectedJobProfile={setSelectedJobProfile}
          setManualJobDescription={setManualJobDescription}
          websocketRef={websocketRef}
        />
      )}

      {/* Step 3: Configure Devices */}
      {step === 3 && (
        <DeviceSelection
          videoRef={videoRef}
          isCameraEnabled={isCameraEnabled}
          isMicEnabled={isMicEnabled}
          isSoundEnabled={isSoundEnabled}
          setIsCameraEnabled={setIsCameraEnabled}
          setIsMicEnabled={setIsMicEnabled}
          setIsMicTestEnabled={setIsMicTestEnabled}
          setIsSoundEnabled={setIsSoundEnabled}
          setIsSoundTesting={setIsSoundTesting}
          isMicTestEnabled={isMicTestEnabled}
          isSoundTesting={isSoundTesting}
          handleSoundConfirmation={handleSoundConfirmation}
          startMicrophoneTest={startMicrophoneTest}
          stopMicrophoneTest={stopMicrophoneTest}
          volume={volume}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          allDevicesConfigured={allDevicesConfigured}
        />

      )}
    </>
  );
};

export default InterviewComponent;