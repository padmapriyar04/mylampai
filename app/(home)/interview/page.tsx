"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoDocumentAttach } from "react-icons/io5";
import AudioToText from "./recording";
import { FiMic, FiSpeaker, FiVideo, FiMessageSquare } from "react-icons/fi";
import useInterviewStore from './store';
import Image from "next/image"
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import DeviceSelection from './DeviceSelection'; // Importing the DeviceSelection component

const InterviewComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resumeFile, setResumeFile, jobDescriptionFile, setJobDescriptionFile } = useInterviewStore();
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState('');
  const [selectedJobProfile, setSelectedJobProfile] = useState('');
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundTesting, setIsSoundTesting] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isMicTestEnabled, setIsMicTestEnabled] = useState(false);
  const [cvText, setCvText] = useState('');
  const [JD, setJD] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [audioTextInputs, setAudioTextInputs] = useState([]);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [textToSpeak, setTextToSpeak] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);

  const allDevicesConfigured = isCameraEnabled && isMicEnabled && isSoundEnabled;

  const websocketRef = useRef<WebSocket | null>(null);

  const waitForSocketConnection = (socket) => {
    return new Promise((resolve) => {
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

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !websocketRef.current) {
      websocketRef.current = new WebSocket("wss://ai-interviewer-c476.onrender.com/ws");

      waitForSocketConnection(websocketRef.current).then(() => {
        console.log("WebSocket is ready to send messages");
      });

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "cv_uploaded") {
          console.log("CV uploaded:", data.message);
          setCvText(data.cv_text);  // Update the state with CV text
        } else if (data.type === "jd_analyzed") {
          console.log("Job description analyzed:", data.message);
          setJD(data.job_description);  // Update the state with JD text
        } else if (data.type === "interview_question") {
          console.log("Interview question received:", data.question);
          setChatMessages((prevMessages) => [...prevMessages, { user: "Interviewer", message: data.question }]);
          setTextToSpeak(data.question);
        } else if (data.type === "interview_end") {
          console.log("Interview ended:", data.message);
          setChatMessages((prevMessages) => [...prevMessages, { user: "System", message: data.message }]);
        } else if (data.type === "analysis") {
          console.log("Analysis result received:", data.result);
          setChatMessages((prevMessages) => [...prevMessages, { user: "Analysis", message: JSON.stringify(data.result) }]);
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

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [...prevMessages, { user: "You", message }]);
      websocketRef.current?.send(JSON.stringify({ type: "answer", answer: message }));
    }
  };

  const handleTextSubmit = (text) => {
    setAudioTextInputs((prevInputs) => [...prevInputs, text]); // Store the audio-to-text input
    websocketRef.current?.send(
      JSON.stringify({
        type: "answer",
        answer: text,
      })
    );
    setChatMessages((prevMessages) => [...prevMessages, { user: "You", message: text }]);
  };

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription("");
  };

  const handleSpeak = () => {
    if (!textToSpeak) return;

    console.log("Speak function called with text:", textToSpeak);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (textToSpeak) {
      console.log("Text to Speak:", textToSpeak);
      handleSpeak();
    }
  }, [textToSpeak]);

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryData = event.target.result;
        console.log("Resume binary data:", binaryData); // Debugging log

        await waitForSocketConnection(websocketRef.current); // Ensure WebSocket is ready
        websocketRef.current?.send(
          JSON.stringify({
            type: "upload_cv",
            cv_data: Array.from(new Uint8Array(binaryData)),
          })
        );
        setCvText("Uploaded");

        // Check if JD is also uploaded
        if (JD) {
          startInterview();
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
      setResumeFile(null);
    }
  };

  const handleJobDescriptionUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setJobDescriptionFile(file);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryData = event.target.result;
        console.log("JD binary data:", binaryData); // Debugging log

        await waitForSocketConnection(websocketRef.current); // Ensure WebSocket is ready
        websocketRef.current?.send(
          JSON.stringify({
            type: "analyze_jd",
            job_description: Array.from(new Uint8Array(binaryData)),
          })
        );
        setJD("Uploaded");

        // Check if CV is also uploaded
        if (cvText) {
          startInterview();
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
    }
  };

  const startInterview = () => {
    if (cvText && JD) {
      console.log('Starting interview with:', { cvText, JD });
      waitForSocketConnection(websocketRef.current).then(() => {
        console.log('WebSocket is ready to send start_interview');
        websocketRef.current?.send(
          JSON.stringify({
            type: "start_interview",
            pdf_text: cvText, // Use actual cvText
            job_description: JD, // Use actual JD
          })
        );
        setIsInterviewStarted(true);  // Set interview started state
      }).catch(err => {
        console.error('Failed to start interview:', err);
      });
    } else {
      console.error("CV or JD not uploaded, cannot start interview.");
    }
  };

  const handleNextClick = () => {
    if (step === 3 && allDevicesConfigured) {
      if (!cvText || !JD) {
        alert("Please upload both the CV and Job Description before starting the interview.");
        return;
      }
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

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior to allow dropping
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };

  const triggerFileInput = (inputId) => {
    // Trigger the file input click
    document.getElementById(inputId)?.click();

    // Check if both CV and Job Description are uploaded
    if (cvText && JD) {
      // Start the interview and set the state
      startInterview();
    } else {
      console.error("CV or JD not uploaded, cannot start the interview.");
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if ((isCameraEnabled || isInterviewStarted) && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log("Camera enabled: Stream acquired");
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Unable to access camera: " + err.message);
        });
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [isCameraEnabled, isInterviewStarted]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [activeTab, setActiveTab] = useState('conversation');

  if (!isMounted) {
    return null;
  }

  const handleManualJDUpload = () => {
    if (manualJobDescription.trim() !== "") {
      setJD(manualJobDescription.trim());

      // Send the manually entered JD to the WebSocket
      websocketRef.current?.send(
        JSON.stringify({
          type: "analyze_jd",
          job_description: manualJobDescription.trim(),
        })
      );

      // You can also add a condition to automatically start the interview if the CV is also uploaded
      if (cvText && JD) {

      }
    } else {
      alert("Please fill in the job description.");
    }
  };

  const handleMicTestConfirmation = () => {
    setIsMicTestEnabled(false);  // Disable mic test mode
    setIsMicEnabled(true);       // Mark microphone as enabled
    stopMicrophoneTest();        // Stop the microphone test
  };

  const handleSoundConfirmation = () => {
    stopTestSound();           // Stop the sound test
    setIsSoundEnabled(true);   // Mark sound as enabled
    setIsSoundTesting(false);  // Disable sound testing mode
  };

  const startMicrophoneTest = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
      .catch((err) => {
        console.error("Error accessing microphone: ", err);
        alert("Unable to access microphone: " + err.message);
      });
  };
  
  const updateVolume = () => {
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const volume = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
    setVolume(volume);
    rafIdRef.current = requestAnimationFrame(updateVolume);
  };
  
  const stopMicrophoneTest = () => {
    cancelAnimationFrame(rafIdRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setVolume(0);
  };

  const stopTestSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;  // Reset the audio to the start
    }
  };
  
  

  if (isInterviewStarted) {
    return (
      <div className="min-h-screen flex flex-col relative">
        {/* Navbar */}
        <nav className="flex justify-between items-center bg-white shadow-md p-4">
          <div className="flex items-center">
            <img src="/path_to_your_logo.svg" alt="wiZe Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold text-purple-600">wiZe</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-4" id="status"></span>
            <button className="mr-4" onClick={() => setIsChatOpen(!isChatOpen)}>
              <FiMessageSquare className="w-6 h-6 text-gray-600" />
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => window.close()} // Close the tab
            >
              End Interview
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex justify-center items-center bg-gray-100 overflow-hidden h-screen">
          <video
            ref={videoRef}
            className="w-full h-full max-w-screen max-h-screen object-cover rounded-lg shadow-lg transform scale-75"
            autoPlay
            muted
          />
        </div>

        {/* Microphone enabled: Display AudioToText */}
        {isMicEnabled && <AudioToText onTextSubmit={handleTextSubmit} />} {/* Display when mic is enabled */}

        {/* Prompt Box */}
        {isChatOpen && (
          <div className="absolute top-20 right-6 bg-white border border-gray-300 shadow-lg rounded-lg w-96 h-1/2 flex flex-col">
            <div className="flex justify-between items-center bg-purple-600 text-white p-4 rounded-t-lg">
              <span className="font-semibold text-lg">Prompt Box</span>
              <button onClick={() => setIsChatOpen(false)} className="text-white text-2xl">
                &times;
              </button>
            </div>

            {/* Tabs for switching between sections */}
            <div className="flex border-b border-gray-300">
              <button
                className={`flex-1 text-center p-2 ${activeTab === 'conversation' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('conversation')}
              >
                Conversation
              </button>
              <button
                className={`flex-1 text-center p-2 ${activeTab === 'audioToText' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('audioToText')}
              >
                Audio-to-Text
              </button>
            </div>

            {/* Content Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'conversation' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Conversation</h3>
                  {chatMessages.map((chat, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                      <span className="font-semibold">{chat.user}: </span>
                      <span>{chat.message}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'audioToText' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Audio-to-Text Inputs</h3>
                  {audioTextInputs.map((text, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded-md">
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input and Buttons Container */}
            <div className="p-4 bg-gray-100 border-t border-gray-300">
              <input
                id="answerInput"
                type="text"
                placeholder="Type your answer here"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none mb-2"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const answer = e.target.value;
                    handleSendMessage(answer);
                    e.target.value = "";
                  }
                }}
              />
              <div className="flex justify-between">
                <button
                  id="sendAnswerButton"
                  className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => {
                    const answer = document.getElementById("answerInput").value;
                    if (answer) {
                      handleSendMessage(answer);
                      document.getElementById("answerInput").value = "";
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
                      })
                    );
                  }}
                >
                  Get Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-primary-foreground flex items-center justify-center w-full border-t-2 border-[#eeeeee]">
      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="max-w-[1200px] gap-4 w-full flex justify-between ">
          {/* Left Section */}
          <div className="w-full max-w-[450px] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg text-white rounded-3xl p-10 relative">
            <Image src={"/images/Globe.svg"} className='w-full h-auto' alt="image" width={100} height={100}></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground">
            <div ><p className='text-2xl font-bold text-primary mb-2'>Get Started!</p></div>

            <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
              {/* Progress Bar */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${resumeFile ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(resumeFile) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 2 */}
              <div className="relative flex-1">
                <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                  {(jobDescriptionFile || isManualEntry) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
              </div>
              {/* Step 3 */}
              <div className="relative  flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6 mt-3 w-[100%]">
              <h3 className="text-sm xl:text-2xl font-bold text-gray-800">Upload your latest CV/Resume</h3>
            </div>

            {/* Upload Section */}
            <div className="bg-white py-4 px-8 rounded-3xl w-full max-w-[400px] shadow-lg text-center">
              <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-[2vw]">
                <IoDocumentAttach />
              </div>

              <div
                className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white "
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, setResumeFile)}
              >
                <p className="text-gray-500 mt-2 text-sm">Drag & Drop or</p>
                <label
                  htmlFor="resumeUpload"
                  className="text-gray-500 cursor-pointer text-sm"
                >
                  Click to <span className="font-semibold text-gray-700 ">Upload Resume</span>
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

                <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
              </div>

              {/* Upload Button */}
              <div className="flex justify-center mt-2">
                <button
                  className="bg-primary md:text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => triggerFileInput('resumeUpload')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Upload Resume
                </button>
              </div>

            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${resumeFile ? 'bg-gray-600 text-black hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                disabled={!resumeFile}
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
        <div className="max-w-[1200px] gap-4 w-full flex justify-between ">
          {/* Left Section */}
          <div className="w-full max-w-[450px] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg text-white rounded-3xl p-10 relative">
            <Image src={"/images/Globe.svg"} className='w-full h-auto' alt="image" width={100} height={100}></Image>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You&apos;ll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full max-w-[700px] h-full  flex flex-col items-center justify-center bg-primary-foreground">
            <div className="w-full flex flex-col items-center mb-2">
              <div ><p className='text-2xl font-bold text-primary mb-2'>Get Started!</p></div>
              <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
                {/* Progress Bar */}
                <div className="relative flex-1">
                  <div className={`w-8 h-8 ${resumeFile ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                    {(resumeFile) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
                </div>
                {/* Step 2 */}
                <div className="relative flex-1">
                  <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                    {(jobDescriptionFile || isManualEntry) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
                </div>
                {/* Step 3 */}
                <div className="relative  flex items-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">Choose your Interview Profile</h3>

            <div className="bg-white py-4 px-8 rounded-3xl w-full max-w-[400px] shadow-lg text-center">

              <div className="w-full flex justify-center mb-6">
                <button
                  className={`px-6 py-2 font-semibold ${!isManualEntry ? 'text-white bg-primary' : 'text-primary bg-gray-100'} rounded-lg focus:outline-none`}
                  onClick={handleUploadJDToggle}
                >
                  Upload JD
                </button>
                <button
                  className={`px-6 py-2 font-semibold ${isManualEntry ? 'text-white bg-primary' : 'text-primaary bg-gray-100'} rounded-lg focus:outline-none`}
                  onClick={handleManualEntryToggle}
                >
                  Fill Manually
                </button>
              </div>

              {isManualEntry ? (
                <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center mb-8">
                  <textarea
                    className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-center placeholder:text-gray-500"
                    placeholder="Write or paste here complete job details (Word limit 1000 words)"
                    maxLength={1000}
                    value={manualJobDescription}
                    onChange={(e) => setManualJobDescription(e.target.value)}
                  />
                  <p className="text-gray-400 text-sm mt-2">Word limit 1000 words.</p>
                  <div className="w-full text-center mt-4">
                    <button
                      onClick={handleManualJDUpload}
                      className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-purple-600 focus:outline-none"
                    >
                      Upload JD
                    </button>
                  </div>
                </div>

              ) : (
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white " onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, setJobDescriptionFile)}>
                  <div className="text-4xl mb-3 text-gray-300">
                    <IoCloudUploadOutline />
                  </div>
                  <p className="text-gray-500 mb-2">Drag & Drop or</p>
                  <label htmlFor="jobDescriptionUpload" className="text-gray-500 cursor-pointer">
                    Click to <span className="font-semibold text-gray-700">Upload Job Description</span>
                  </label>
                  <input id="jobDescriptionUpload" type="file" accept=".doc,.docx,.pdf" className="hidden" onChange={handleJobDescriptionUpload} />
                  <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
                </div>
              )}

            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${(jobDescriptionFile || (isManualEntry && manualJobDescription)) ? 'bg-gray-600 text-black hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                disabled={!jobDescriptionFile && !(isManualEntry && manualJobDescription)}
                onClick={handleNextClick}
              >
                Next
              </button>
              <button className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition" onClick={handleBackClick}>
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
        />
      )}
    </div>
  )
};

export default InterviewComponent;
