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

  const [cvText, setCvText] = useState("");
  const [JD, setJD] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
      if (!cvText || !JD) {
        alert(
          "Please upload both the CV and Job Description before starting the interview.",
        );
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
    const jobDescription = manualJobDescription === "Other" ? customProfile.trim() : manualJobDescription.trim();
  
    if (jobDescription !== "") {
      setJD(jobDescription);
  
      websocketRef.current?.send(
        JSON.stringify({
          type: "analyze_jd",
          job_description: jobDescription,
        }),
      );
  
      if (cvText && JD) {
        toast.success("Job Description uploaded successfully");
      }
    } else {
      alert("Please fill in the job description.");
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
      <div className="min-h-[calc(100vh-4rem)] w-full h-full flex flex-col relative bg-primary-foreground">
        {/* Navbar */}
        <nav className="flex justify-between items-center bg-white shadow-md p-4">
          <div className="flex items-center">
            <img
              src="/home/logo.svg"
              alt="wiZe Logo"
              className="h-auto w-48 ml-2"
            />
          </div>
          <div className="font-medium text-lg">
            Technical Interview 1st round
          </div>
  
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-4" id="status"></span>
            <button className="mr-6" onClick={() => setIsChatOpen(!isChatOpen)}>
              <PiChatsThin className="w-10 h-10 text-gray-600" />
            </button>
            <button
              className="bg-red-500 text-white px-4 py-3 rounded-full font-semibold"
              onClick={() => window.close()} // Close the tab
            >
              END INTERVIEW
            </button>
          </div>
        </nav>
        {/* Main Content */}
        <div
          className={`flex-1 flex min-h-[100vh] justify-items-center bg-primary-foreground overflow-hidden transition-all duration-300 ${
            isChatOpen ? "w-[80vw]" : "w-full"
          }`}
        >
          <video
            ref={videoRef}
            className="w-full h-full max-w-screen max-h-screen object-cover rounded-lg shadow-lg transform scale-75"
            autoPlay
            muted
          />
        </div>
        {/* Microphone enabled: Display AudioToText */}
        {isMicEnabled && (
          <AudioToText
            onTextSubmit={handleTextSubmit}
            isSpeaking={isSpeaking} // Pass the isSpeaking state
            isMicTestCompleted={isMicTestCompleted}
          />
        )}
  
        {/* Display when mic is enabled */}
        {/* Prompt Box */}
        {isChatOpen && (
          <div className="absolute top-[5.7rem] right-6 bg-white border border-gray-300 shadow-lg rounded-xl w-[25vw] h-3/4 flex flex-col">
            <div className="flex justify-between items-center bg-primary text-white p-4 rounded-t-lg">
              <span className="font-semibold text-lg">Prompt Box</span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white text-2xl"
              >
                &times;
              </button>
            </div>
  
            {/* Tabs for switching between sections */}
            <div className="flex border-b border-gray-300 rounded-b-lg">
              <button
                className={`flex-1 text-center p-2 rounded-bl-lg ${activeTab === "conversation" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setActiveTab("conversation")}
              >
                Conversation
              </button>
              <button
                className={`flex-1 text-center p-2 rounded-br-lg ${activeTab === "audioToText" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setActiveTab("audioToText")}
              >
                Audio-to-Text
              </button>
            </div>
  
            {/* Content Sections */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {activeTab === "conversation" && (
                <div>
                  {chatMessages.map((chat, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-2 rounded-md mb-2"
                    >
                      <span className="font-semibold">{chat.user}: </span>
                      <span>{chat.message}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "audioToText" && (
                <div>
                  {audioTextInputs.map((text, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded-md">
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            {/* Input and Buttons Container */}
            <div className="p-4 bg-gray-100 border-t border-b border-gray-300 rounded-lg">
              <input
                id="answerInput"
                type="text"
                placeholder="Type your answer here"
                className="w-full px-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none mb-4"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    const answer = target.value;
                    handleSendMessage(answer);
                    target.value = "";
                  }
                }}
              />
  
              <div className="flex justify-between">
                <button
                  id="sendAnswerButton"
                  className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => {
                    const answer = (
                      document.getElementById("answerInput") as HTMLInputElement
                    ).value;
                    if (answer) {
                      handleSendMessage(answer);
                      (
                        document.getElementById(
                          "answerInput",
                        ) as HTMLInputElement
                      ).value = "";
                    }
                  }}
                >
                  Send Answer
                </button>
  
                <button
                  id="getAnalysisButton"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition"
                  onClick={() => {
                    websocketRef.current?.send(
                      JSON.stringify({
                        type: "get_analysis",
                      }),
                    );
                  }}
                >
                  Get Analysis
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
  

  return (
    <div className="md:h-[calc(100vh-4rem)] h-[140vh] bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee] ">
      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="max-w-[1200px] gap-4 w-full flex flex-col  items-center md:flex-row justify-between">
          {/* Left Section */}

          <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative">
            <Image
              src={"/images/Globe.svg"}
              className="w-full h-auto"
              alt="image"
              width={100}
              height={100}
            ></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">
                Take the wiZe AI mock Interview
              </h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills
                evaluated. Just relax and take the interview.{" "}
                <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full  md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
            <div>
              <p className="text-2xl font-bold text-primary mb-2">
                Get Started!
              </p>
            </div>

            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
                <div
                  className={`w-8 h-8 ${isResumeUploaded ? "bg-purple-500" : "bg-gray-400"} rounded-full flex items-center justify-center`}
                >
                  {isResumeUploaded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${resumeFile ? "bg-primary w-full" : "bg-gray-400 w-full"} z-0`}
                ></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div
                  className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? "bg-primary" : "bg-gray-400"} rounded-full flex items-center justify-center`}
                >
                  {jobDescriptionFile || isManualEntry ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? "bg-primary w-full" : "bg-gray-400 w-full"} z-0`}
                ></div>
              </div>
              {/* Step 3 */}
              <div className="relative  flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6 mt-3 w-[100%]">
              <h3 className="text-2xl font-bold text-gray-800">
                Upload your latest CV/Resume
              </h3>
            </div>

            <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[280px]  shadow-lg text-center">
              <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-3xl">
                <IoDocumentAttach />
              </div>

              {resumeFile ? (
                <div className="text-center text-gray-600 font-semibold relative">
                  Resume Uploaded: {resumeFile.name}
                  <button
                    className="absolute top-0 right-0 text-gray-600 hover:text-red-600 focus:outline-none"
                    onClick={handleDeleteResume}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white h-[145px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, setResumeFile)}
                >
                  <p className="text-gray-500 mt-2 text-sm">Drag & Drop or</p>
                  <label
                    htmlFor="resumeUpload"
                    className="text-gray-500 cursor-pointer text-sm"
                  >
                    Click to <span className="font-semibold text-gray-700">Upload Resume</span>
                  </label>
                  <input
                    id="resumeUpload"
                    type="file"
                    accept=".doc,.docx,.pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />

                  <div className="text-4xl mt-3 text-gray-300">
                    <IoCloudUploadOutline />
                  </div>

                  <p className="text-gray-400 text-sm mt-3">
                    Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-center mt-2">
              <button
                className={`bg-primary text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl ${resumeFile ? 'cursor-not-allowed bg-gray-400' : 'hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition'}`}
                onClick={() => !resumeFile && triggerFileInput("resumeUpload")}
                disabled={!!resumeFile || isUploading}
            >
                {isUploading ? "Uploading..." : resumeFile ? 'Resume Uploaded' : 'Upload Resume'}
            </button>
              </div>
            </div>

            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw]  xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${resumeFile ? "bg-gray-600 text-black hover:bg-gray-800 text-white" : "bg-gray-300 text-gray-800 cursor-not-allowed"}`}
                disabled={!resumeFile || isUploading}
                onClick={handleNextClick}
              >
                Next
              </button>
              <button
                className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
                onClick={handleBackClick}
                disabled={step === 1}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Upload Job Description */}
      {step === 2 && (
        <div className="max-w-[1200px] gap-4 w-full flex flex-col  items-center md:flex-row md:justify-between">
          {/* Left Section */}
          <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative">
            <Image
              src={"/images/Globe.svg"}
              className="w-full h-auto"
              alt="image"
              width={100}
              height={100}
            ></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">
                Take the wiZe AI mock Interview
              </h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills
                evaluated. Just relax and take the interview.{" "}
                <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full  md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
            <div className="w-full flex flex-col items-center mb-2">
              <div>
                <p className="text-2xl font-bold text-primary mb-2">
                  Get Started!
                </p>
              </div>
              <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
                {/* Progress Bar */}
                <div className="relative flex-1">
                  <div
                    className={`w-8 h-8 ${isResumeUploaded ? "bg-purple-500" : "bg-gray-400"} rounded-full flex items-center justify-center`}
                  >
                    {isResumeUploaded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${resumeFile ? "bg-primary w-full" : "bg-gray-400 w-full"} z-0`}
                  ></div>
                </div>
                {/* Step 2 */}
                <div className="relative flex-1">
                  <div
                    className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? "bg-primary" : "bg-gray-400"} rounded-full flex items-center justify-center`}
                  >
                    {jobDescriptionFile || isManualEntry ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? "bg-primary w-full" : "bg-gray-400 w-full"} z-0`}
                  ></div>
                </div>
                {/* Step 3 */}
                <div className="relative  flex items-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">
              Choose your Interview Profile
            </h3>

            {/* Right Section */}
<div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] shadow-lg text-center">
    <div className="w-full flex justify-center mb-6">
        <label htmlFor="jobProfileDropdown" className="text-gray-700 font-semibold">
            Select Job Profile:
        </label>
    </div>

    <select
        id="jobProfileDropdown"
        className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={selectedJobProfile}
        onChange={(e) => setSelectedJobProfile(e.target.value)}
    >
        <option value="">Select a profile</option>
        {jobProfiles.map((profile) => (
            <option key={profile} value={profile}>
                {profile}
            </option>
        ))}
    </select>

    <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center mb-8">
        <textarea
            className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-center placeholder:text-gray-500"
            placeholder="Write or paste here complete job details (Word limit 1000 words)"
            maxLength={1000}
            value={manualJobDescription}
            onChange={(e) => setManualJobDescription(e.target.value)}
        />
        <p className="text-gray-400 text-sm mt-2">
            Word limit 1000 words.
        </p>
        <div className="w-full text-center mt-4">
            <button
                onClick={handleManualJDUpload}
                className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-purple-600 focus:outline-none"
            >
                Submit JD
            </button>
        </div>
    </div>


              )}
            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
            <button
  className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
    jobDescriptionFile || (isManualEntry && manualJobDescription) 
      ? "bg-gray-600 text-black hover:bg-gray-800 text-white" 
      : "bg-gray-300 text-gray-800 cursor-not-allowed"
  }`}
  disabled={!jobDescriptionFile && !(isManualEntry && manualJobDescription)}
  onClick={handleNextClick}
>
  Next
</button>
              <button
                className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
                onClick={handleBackClick}
              >
                Back
              </button>
            </div>
          </div>
        </div>
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