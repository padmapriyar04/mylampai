"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  DragEvent,
  ChangeEvent,
} from "react";
import { useRouterStore } from "@/utils/useRouteStore";
import InterviewPage from "./InterviewPage";
import { toast } from "sonner";
import { useWebSocketContext } from "@/hooks/webSocketContext";
import * as pdfjsLib from "pdfjs-dist";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { IoDocumentAttach, IoCloudUploadOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type ChatMessage = {
  user: string;
  message: string;
};

const InterviewComponent = () => {
  const { ws } = useWebSocketContext();
  const { changeRoute } = useRouterStore();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [manualJobDescription, setManualJobDescription] = useState("");
  const [jdFile, setJDFile] = useState<File | null>(null);
  const [selectedJobProfile, setSelectedJobProfile] = useState("");
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const [cvText, setCvText] = useState("");
  const [showTextbox, setShowTextbox] = useState(false);
  const [JD, setJD] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  const [textToSpeak, setTextToSpeak] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const allDevicesConfigured =
    isCameraEnabled && isMicEnabled && isSoundEnabled;

  const jobProfiles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Business Analyst",
    "DevOps Engineer",
    "System Administrator",
  ];

  const updateDeviceList = useCallback(() => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
      }

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            // console.log(
            //   `${device.kind}: ${device.label} id = ${device.deviceId}`
            // );
            console.log(device);
          });
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          toast.error("Camera and/or microphone access denied.");
        } else if (error.name === "NotFoundError") {
          toast.error("No media devices found.");
        } else {
          toast.error("Error accessing media devices:");
          console.log("Error accessing media devices: ", error);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "cv_uploaded":
            setIsUploading(false);
            toast.success("Resume uploaded successfully");
            setCvText(data.cv_text);
            break;

          case "jd_analyzed":
            setJD(data.job_description);
            setIsNextEnabled(true);
            break;

          case "interview_started":
            setIsInterviewStarted(true);
            break;

          case "interview_question":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "Interviewer", message: data.question },
            ]);
            setTextToSpeak(data.question);
            setLoading(false);
            break;

          case "coding_question":
            ws.send(
              JSON.stringify({
                type: "coding",
                code: "This is a dummy response to the coding question.",
                ques: data.message,
              })
            );
            break;

          case "code_evaluation":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              {
                user: "System",
                message: "Code evaluation result: " + data.result,
              },
            ]);
            break;

          case "interview_end":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "System", message: data.message },
            ]);
            break;

          case "analysis":
            setAnalysisData(data.result); // Store analysis data
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "Analysis", message: JSON.stringify(data.result) },
            ]);
            break;

          default:
            break;
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
      ws?.send(JSON.stringify({ type: "answer", answer: message }));
    }
  };

  const handleTextSubmit = (text: string) => {
    ws?.send(
      JSON.stringify({
        type: "answer",
        answer: text,
      })
    );
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", message: text },
    ]);
  };

  useEffect(() => {
    navigator.mediaDevices.ondevicechange = () => {
      updateDeviceList();
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

    if (textToSpeak) {
      handleSpeak();
    }
  }, [textToSpeak]);

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    setFile: (file: File) => void
  ) => {
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

    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setIsUploading(true);

      setResumeFile(file);
      setCvText(file.name);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryData = e.target?.result as ArrayBuffer;
        if (binaryData && ws) {
          ws?.send(
            JSON.stringify({
              type: "upload_cv",
              cv_data: Array.from(new Uint8Array(binaryData)),
            })
          );
        } else {
          toast.error("WebSocket is not initialized");
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);

        if (typeof window !== "undefined") {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            text += ` ${pageText}`;
          }
          resolve(text.trim());
        } else {
          reject(
            new Error("pdfjs-dist is not available in the server environment")
          );
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleJDUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJDFile(file);

      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      if (extractedText && ws) {
        ws.send(
          JSON.stringify({ type: "analyze_jd", job_description: extractedText })
        );
      } else {
        console.error(
          "WebSocket is not initialized or extractedText is empty."
        );
      }
    }
  };

  const handleJDDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setJDFile(file);

      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      if (extractedText && ws) {
        ws.send(JSON.stringify({ type: "analyze_jd", data: extractedText }));
        setJD("Uploaded");
      }
    }
  };

  const handleProfileChange = (profile: string) => {
    setSelectedJobProfile(profile);

    if (profile === "Other") {
      setShowTextbox(true);
    } else {
      setShowTextbox(false);
      setJD(profile);

      if (ws) {
        ws.send(
          JSON.stringify({
            type: "analyze_jd",
            job_description: profile,
          })
        );
      }
    }
  };

  const handleManualDescriptionChange = (description: string) => {
    setManualJobDescription(description);
  };

  const startInterview = () => {
    if (cvText && JD) {
      if (ws) {
        ws.send(
          JSON.stringify({
            type: "start_interview",
            pdf_text: cvText,
            job_description: JD,
          })
        );
      } else {
        console.error("WebSocket is not initialized");
      }
    } else {
      console.error("CV or JD not uploaded, cannot start interview.");
    }
  };

  const handleNextClick = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!cvText || !JD) {
      toast.error(
        "Please upload both the CV and Job Description before starting the interview."
      );
      return;
    }

    changeRoute(false);
    startInterview();
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

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isInterviewStarted) {
    return (
      <InterviewPage
        isMicEnabled={isMicEnabled}
        isSpeaking={isSpeaking}
        chatMessages={chatMessages}
        loading={loading}
        handleTextSubmit={handleTextSubmit}
        handleSendMessage={handleSendMessage}
        analysisData={analysisData}
      />
    );
  }

  return (
    <>
      {/* <Button className="hover:bg-slate-700" onClick={updateDeviceList}>
        Check
      </Button> */}
      {step === 1 && (
        <div className="max-w-[1200px] gap-4 w-full flex flex-col items-center md:flex-row justify-between">
          <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative">
            <Image
              src={"/images/Globe.svg"}
              className="w-full h-auto"
              alt="image"
              width={100}
              height={100}
            />
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
          <div className="w-full md:max-w-[500px] max-h-[90vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
            <div>
              <p className="text-2xl font-bold text-primary mb-2">
                Get Started!
              </p>
            </div>

            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
                <div
                  className={`w-8 h-8 ${
                    !!resumeFile ? "bg-purple-500" : "bg-gray-400"
                  } rounded-full flex items-center justify-center`}
                >
                  {!!resumeFile ? (
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
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                    resumeFile ? "bg-primary w-full" : "bg-gray-400 w-full"
                  } z-0`}
                ></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div
                  className={`w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center`}
                >
                  {resumeFile ? (
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
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-gray-400 w-full z-0`}
                ></div>
              </div>
              {/* Step 3 */}
              <div className="relative flex items-center">
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

            <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[260px] shadow-lg text-center">
              <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-3xl">
                <IoDocumentAttach />
              </div>

              {resumeFile ? (
                <div className="text-center text-gray-600 font-semibold relative h-[135px] flex items-center justify-center">
                  Resume Uploaded: {resumeFile.name}
                  <button
                    className="absolute top-0 right-4 text-gray-600 hover:text-red-600 focus:outline-none"
                    onClick={() => setResumeFile(null)}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white h-[150px] lg:h-[135px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, setResumeFile)}
                >
                  <p className="text-gray-500 mt-2 text-sm lg:text-xs">
                    Drag & Drop or
                  </p>
                  <label
                    htmlFor="resumeUpload"
                    className="text-gray-500 cursor-pointer text-sm lg:text-xs"
                  >
                    Click to{" "}
                    <span className="font-semibold text-gray-700">
                      Upload Resume
                    </span>
                  </label>
                  <input
                    id="resumeUpload"
                    type="file"
                    name="resumeUpload"
                    accept=".doc,.docx,.pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleResumeUpload}
                  />

                  <div className="text-4xl mt-3 text-gray-300">
                    <IoCloudUploadOutline />
                  </div>

                  <p className="text-gray-400 text-sm mt-3 lg:text-xs">
                    Supported file formats: DOC, DOCX, PDF. File size limit 10
                    MB.
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-center mt-2">
                <button
                  className={`bg-primary text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl lg:max-h-[40px] flex items-center justify-center ${
                    resumeFile && !isUploading
                      ? "cursor-not-allowed bg-gray-400"
                      : "hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
                  }`}
                  onClick={handleUploadClick}
                  disabled={!!resumeFile || isUploading}
                >
                  {isUploading
                    ? "Uploading..."
                    : resumeFile
                    ? "Resume Uploaded"
                    : "Upload Resume"}
                </button>
              </div>
            </div>

            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw] xl:w-[32vw] md:max-w-[700px] lg:max-h-[70px] flex justify-center items-center h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
                  resumeFile
                    ? "bg-gray-600 text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-800 cursor-not-allowed"
                }`}
                disabled={!resumeFile || isUploading}
                onClick={handleNextClick}
              >
                Next
              </button>
              <button className="bg-transparent text-gray-700 w-full font-semibold h-12 py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"></button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-[1200px] w-full flex flex-col items-center md:flex-row md:justify-between">
          <div className="max-w-[410px] w-[90vw] md:mt-[8vh] md:w-[29vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative md:left-[35px]">
            <Image
              src={"/images/Globe.svg"}
              className="w-full h-auto"
              alt="image"
              width={100}
              height={100}
            />
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

          <div className="w-full md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
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
                    className={`w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center`}
                  >
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
                  </div>
                  <div
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-primary w-full z-0`}
                  ></div>
                </div>
                {/* Step 2 */}
                <div className="relative flex-1">
                  <div
                    className={`w-8 h-8 ${
                      isNextEnabled ? "bg-primary" : "bg-gray-400"
                    } rounded-full flex items-center justify-center`}
                  >
                    {isNextEnabled ? (
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
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                      isNextEnabled ? "bg-primary w-full" : "bg-gray-400 w-full"
                    } z-0`}
                  ></div>
                </div>
                <div className="relative flex items-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">
              Choose your Interview Profile
            </h3>

            <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[450px] lg:max-w-[450px] shadow-lg text-center flex flex-col items-center">
              <Tabs defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2 bg-primary-foreground py-2 h-auto">
                  <TabsTrigger value="profile">Choose Profile</TabsTrigger>
                  <TabsTrigger value="jd">Upload JD</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <select
                    id="jobProfileDropdown"
                    className="w-full transition p-4 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedJobProfile}
                    onChange={(e) => handleProfileChange(e.target.value)}
                  >
                    <option value="" disabled={!!selectedJobProfile}>
                      Select a profile
                    </option>
                    {jobProfiles.map((profile) => (
                      <option key={profile} value={profile}>
                        {profile}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {showTextbox && (
                    <textarea
                      value={manualJobDescription}
                      onChange={(e) =>
                        handleManualDescriptionChange(e.target.value)
                      }
                      className="mt-4 p-4 border text-center flex items-center justify-center border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full transition"
                      rows={5}
                      placeholder="Please Enter Job Description (word limit is 1000 words)."
                    />
                  )}
                </TabsContent>
                <TabsContent value="jd">
                  <div className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white h-[160px] mt-4">
                    {jdFile ? (
                      <div className="text-center text-gray-600 font-semibold relative h-[150px] flex items-center justify-center">
                        Job Description Uploaded: {jdFile.name}
                        <button
                          className="absolute top-[44%] right-6 text-gray-600 hover:text-red-600 focus:outline-none"
                          onClick={() => setJDFile(null)}
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div onDragOver={handleDragOver} onDrop={handleJDDrop}>
                        <p className="text-gray-500 mt-2 text-sm">
                          Drag & Drop or
                        </p>
                        <label
                          htmlFor="jdUpload"
                          className="text-gray-500 cursor-pointer text-sm"
                        >
                          Click to{" "}
                          <span className="font-semibold text-gray-700">
                            Upload Job Description
                          </span>
                        </label>
                        <input
                          id="jdUpload"
                          type="file"
                          accept=".doc,.docx,.pdf"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleJDUpload}
                        />

                        <div className="text-4xl mt-3 flex justify-center text-gray-300">
                          <IoCloudUploadOutline />
                        </div>

                        <p className="text-gray-400 text-sm mt-3">
                          Supported file formats: DOC, DOCX, PDF. File size
                          limit 10 MB.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-col justify-center items-center mt-6 w-full">
              <button
                onClick={handleNextClick}
                disabled={!isNextEnabled}
                className={`w-[40vw] xl:w-[32vw] md:max-w-[700px] lg:max-h-[70px] flex justify-center items-center h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition 
              ${
                isNextEnabled
                  ? "bg-gray-600 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-800 cursor-not-allowed"
              } rounded-full px-4 py-2`}
              >
                Next
              </button>

              <button
                onClick={handleBackClick}
                className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewComponent;
