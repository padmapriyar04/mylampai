"use client";
import React, {
  useState,
  useRef,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";
import { IoDocumentAttach } from "react-icons/io5";
import AudioToText from "./recording";
import { FiMic, FiSpeaker, FiVideo, FiMessageSquare } from "react-icons/fi";
import { useInterviewStore } from "@/utils/store";
import Image from "next/image";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import DeviceSelection from "./DeviceSelection"; // Importing the DeviceSelection component
import { useRouterStore } from "@/utils/useRouteStore";
import { toast } from "sonner";
import { PiChatsThin } from "react-icons/pi";
import { FiX } from "react-icons/fi"; // Import the FiX icon
import InterviewPage from './InterviewPage';
import StepOne from './StepOne';
import StepTwo from './StepTwo';

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "MyLampAi - Interview",
//     description: "MyLampAi - Home Page",
// };

const InterviewComponent = () => {
  const { changeRoute } = useRouterStore(); // for hiding the default navbar in interview section
  const [isMounted, setIsMounted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState("");
  const [selectedJobProfile, setSelectedJobProfile] = useState("");
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundTesting, setIsSoundTesting] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isMicTestEnabled, setIsMicTestEnabled] = useState(false);
  const [isMicTestCompleted, setIsMicTestCompleted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null); // Step 1: State for storing analysis data

  const [cvText, setCvText] = useState("");
  const [JD, setJD] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [audioTextInputs, setAudioTextInputs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef(null);

  const [textToSpeak, setTextToSpeak] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [customProfile, setCustomProfile] = useState("");

  const [loading,setLoading] = useState(true)
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const allDevicesConfigured =
    isCameraEnabled && isMicEnabled && isSoundEnabled;

  const websocketRef = useRef<WebSocket | null>(null);

  const jobProfiles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Business Analyst",
    "DevOps Engineer",
    "System Administrator",
  ];

  useEffect(() => {
    const savedResume = localStorage.getItem('resumeFile');
    
    if (savedResume) {
      const file = base64ToFile(savedResume, 'resume.pdf');
      setResumeFile(file);
      setIsUploading(true); // Set uploading to true if a resume is found on reload
      sendResumeToWebSocket(file);
    }
  
    setIsMounted(true);
  }, []);
  

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  type ChatMessage = {
    user: string;
    message: string;
  };

  const waitForSocketConnection = (socket: WebSocket) => {
    return new Promise<void>((resolve) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        socket.onopen = () => {
          console.log("WebSocket connection opened");
          resolve();
        };
      }
    });
  };

  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !websocketRef.current) {
      websocketRef.current = new WebSocket(
        "wss://ai-interviewer-c476.onrender.com/ws",
      );

      waitForSocketConnection(websocketRef.current).then(() => {
        console.log("WebSocket is ready to send messages");
      });

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "cv_uploaded") {
          console.log("CV uploaded:", data.message);
          setIsUploading(false);
          setCvText(data.cv_text); // Update the state with CV text
        } else if (data.type === "jd_analyzed") {
          console.log("Job description analyzed:", data.message);
          setJD(data.job_description); // Update the state with JD text
        } else if (data.type === "interview_question") {
          console.log("Interview question received:", data.question);
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "Interviewer", message: data.question },
          ]);
          setTextToSpeak(data.question);
          setLoading(false); // Stop loading when the question is received
        } else if (data.type === "interview_end") {
          console.log("Interview ended:", data.message);
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "System", message: data.message },
          ]);
        } else if (data.type === "analysis") {
          console.log("Analysis result received:", data.result);
          setAnalysisData(data.result); // Store analysis data
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { user: "Analysis", message: JSON.stringify(data.result) },
          ]);
        }
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [isMounted]);

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", message },
      ]);
      websocketRef.current?.send(
        JSON.stringify({ type: "answer", answer: message }),
      );
    }
  };
  

  

  const handleTextSubmit = (text: string) => {
    setAudioTextInputs((prevInputs) => [...prevInputs, text]); // Store the audio-to-text input
    websocketRef.current?.send(
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

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription("");
  };

  const handleSpeak = () => {
    if (!textToSpeak) return;
  
    console.log("Speak function called with text:", textToSpeak);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setIsSpeaking(true); // Set isSpeaking to true when TTS starts
  
    utterance.onend = () => {
      setIsSpeaking(false); // Reset isSpeaking to false when TTS ends
    };
  
    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    if (textToSpeak) {
      console.log("Text to Speak:", textToSpeak);
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
        alert("Please upload a valid DOC, DOCX, or PDF file.");
      }
    }
  };

  // Make sure you define handleResumeUpload in a way that can handle file input
  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        setIsUploading(true); // Set uploading to true when starting upload

        setResumeFile(file);
        const base64 = await fileToBase64(file);
        localStorage.setItem('resumeFile', base64);
        setCvText(file.name); // Update the display text to show the uploaded file name

        // Send the resume to the WebSocket
        const reader = new FileReader();
        reader.onload = async (e) => {
            const binaryData = e.target?.result as ArrayBuffer;
            if (binaryData && websocketRef.current) {
                await waitForSocketConnection(websocketRef.current);
                websocketRef.current.send(
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
        alert("Please upload a valid DOC, DOCX, or PDF file.");
        setResumeFile(null);
        setCvText("");
        setIsUploading(false); // Ensure uploading is turned off on error
    }
};

  const sendResumeToWebSocket = async (file: File) => {
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const binaryData = e.target?.result as ArrayBuffer;
  
      if (binaryData && websocketRef.current) {
        await waitForSocketConnection(websocketRef.current);
        
        websocketRef.current.send(
          JSON.stringify({
            type: "upload_cv",
            cv_data: Array.from(new Uint8Array(binaryData)),
          }),
        );
      }
    };
  
    reader.readAsArrayBuffer(file);
  };

  const isResumeUploaded = !!resumeFile;

  const handleJobDescriptionUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setJobDescriptionFile(file);
      const base64 = await fileToBase64(file);
      localStorage.setItem('jobDescriptionFile', base64);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryData = e.target?.result as ArrayBuffer; // Ensure the result is treated as ArrayBuffer
        console.log("JD binary data:", binaryData); // Debugging log

        if (websocketRef.current) {
          await waitForSocketConnection(websocketRef.current); // Ensure WebSocket is ready

          websocketRef.current.send(
            JSON.stringify({
              type: "analyze_jd",
              job_description: Array.from(new Uint8Array(binaryData)),
            }),
          );
          setJD("Uploaded");
          toast.success("Job Description Uploaded successfully");

          // Check if CV is also uploaded
          if (cvText) {
            startInterview();
          }
        } else {
          console.error("WebSocket is not initialized");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
    }
  };

  const startInterview = () => {
    if (cvText && JD) {
      console.log("Starting interview with:", { cvText, JD });

      if (websocketRef.current) {
        waitForSocketConnection(websocketRef.current)
          .then(() => {
            console.log("WebSocket is ready to send start_interview");
            websocketRef.current?.send(
              JSON.stringify({
                type: "start_interview",
                pdf_text: cvText, // Use actual cvText
                job_description: JD, // Use actual JD
              }),
            );
            setIsInterviewStarted(true); // Set interview started state
            setLoading(true);
          })
          .catch((err) => {
            console.error("Failed to start interview:", err);
          });
      } else {
        console.error("WebSocket is not initialized");
      }
    } else {
      console.error("CV or JD not uploaded, cannot start interview.");
    }
  };

  const handleNextClick = () => {
    if (step === 3 && allDevicesConfigured) {
      // Check if both CV and Job Description are uploaded
      if (!cvText || !JD) {
        alert('Please upload both the CV and Job Description before starting the interview.');
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
    event.stopPropagation(); // Prevent default behavior to allow dropping
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };

  const triggerFileInput = (inputId: string) => {
    // Trigger the file input click
    const inputElement = document.getElementById(
      inputId,
    ) as HTMLInputElement | null;

    if (inputElement) {
      inputElement.click();

      // Check if both CV and Job Description are uploaded
      if (cvText && JD) {
        // Start the interview and set the state
        startInterview();
      } else {
        console.error("CV or JD not uploaded, cannot start the interview.");
      }
    } else {
      console.error(`Input element with id ${inputId} not found.`);
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const enableCamera = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          console.log("Camera enabled: Stream acquired");
          videoRef.current.srcObject = stream; // No need for '!' as videoRef is typed
          videoRef.current.play(); // TypeScript now knows play() exists on HTMLVideoElement
        } catch (err) {
          if (err instanceof Error) {
            console.error("Error accessing camera:", err.message);
            alert("Unable to access camera: " + err.message);
          } else {
            console.error("Unknown error accessing camera");
            alert("Unable to access camera due to an unknown error.");
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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [activeTab, setActiveTab] = useState("conversation");

  if (!isMounted) {
    return null;
  }

  const handleManualJDUpload = () => {
    // Set job description based on manual entry or custom profile for "Other"
    const jobDescription = manualJobDescription === 'Other' ? customProfile.trim() : manualJobDescription.trim();
  
    if (jobDescription !== '') {
      setJD(jobDescription); // Set JD for manual job descriptions
      websocketRef.current?.send(
        JSON.stringify({
          type: 'analyze_jd',
          job_description: jobDescription,
        }),
      );
  
      if (cvText && jobDescription) {
        toast.success('Job Description uploaded successfully');
      }
    } else {
      alert('Please fill in the job description.');
    }
  };
  

  const handleMicTestConfirmation = () => {
    setIsMicTestEnabled(false); // Disable mic test mode
    setIsMicEnabled(true); // Mark microphone as enabled
    stopMicrophoneTest(); // Stop the microphone test
  
    // Notify parent component that mic test is completed
    if (typeof onMicTestComplete === 'function') {
      onMicTestComplete(); // Call this prop function to notify the parent
    }
  };
  
  const handleSoundConfirmation = () => {
    stopTestSound(); // Stop the sound test
    setIsSoundEnabled(true); // Mark sound as enabled
    setIsSoundTesting(false); // Disable sound testing mode
  };

  const startMicrophoneTest = () => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;

    if (!AudioContext) {
      alert("Web Audio API is not supported in this browser");
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
          alert("Unable to access microphone: " + err.message);
        } else {
          alert("Unable to access microphone due to an unknown error.");
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

  const handleDeleteResume = () => {
    setResumeFile(null);
    setCvText("");
    localStorage.removeItem('resumeFile'); // Also remove the file from local storage
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
      isMicTestCompleted={isMicTestCompleted}
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
    <div className="md:h-[calc(100vh-4rem)] h-[132vh] overflow-y-scroll bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee] ">
      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div>
        <StepOne
          isResumeUploaded={!!resumeFile}
          resumeFile={resumeFile}
          isUploading={isUploading}
          handleResumeUpload={handleResumeUpload}
          handleDragOver={handleDragOver}
          handleDrop={(e) => handleDrop(e, setResumeFile)}
          handleDeleteResume={handleDeleteResume}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
        />
      </div>
      )}

      {/* Step 2: Upload Job Description */}
      {step === 2 && (
        <StepTwo
        JD={JD}
        isResumeUploaded={isResumeUploaded}
        jobDescriptionFile={jobDescriptionFile}
        isManualEntry={isManualEntry}
        manualJobDescription={manualJobDescription}
        selectedJobProfile={selectedJobProfile}
        jobProfiles={jobProfiles}
        setJD={setJD}
        handleManualJDUpload={handleManualJDUpload}
        handleNextClick={handleNextClick}
        handleBackClick={handleBackClick}
        setSelectedJobProfile={setSelectedJobProfile}
        setManualJobDescription={setManualJobDescription}
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
          handleMicTestConfirmation={handleMicTestConfirmation}
          handleSoundConfirmation={handleSoundConfirmation}
          startMicrophoneTest={startMicrophoneTest}
          stopMicrophoneTest={stopMicrophoneTest}
          volume={volume}
          setVolume={setVolume}
          updateVolume={updateVolume}
          rafIdRef={rafIdRef}
          audioContextRef={audioContextRef}
          analyserRef={analyserRef}
          dataArrayRef={dataArrayRef}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          allDevicesConfigured={allDevicesConfigured}
          onMicTestComplete={() => setIsMicTestCompleted(true)}
        />

      )}
    </div>
  );
};

export default InterviewComponent;