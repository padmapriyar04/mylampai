"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiSpeaker, FiVideo } from 'react-icons/fi';
import InterviewPage from "../interviewPage/page"

const UploadResumePage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState("");
  const [selectedJobProfile, setSelectedJobProfile] = useState("");
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isSoundTesting, setIsSoundTesting] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isMicTestEnabled, setIsMicTestEnabled] = useState(false);
  const [cvText, setCvText] = useState('');
  const [JD, setJD] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const allDevicesConfigured = isCameraEnabled && isMicEnabled && isSoundEnabled;


  useEffect(() => {
    websocketRef.current = new WebSocket('wss://ai-interviewer-c476.onrender.com/ws');

    

    websocketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'cv_uploaded') {
        console.log('CV uploaded:', data.message);
        setCvText(data.cv_text);
      } else if (data.type === 'jd_analyzed') {
        console.log('Job description analyzed:', data.message);
        setJD(data.job_description);
      } else if (data.type === 'interview_question') {
        console.log('Interview question received:', data.question);
        appendToChatBox('Interviewer: ' + data.question);
      } else if (data.type === 'interview_end') {
        console.log('Interview ended:', data.message);
        appendToChatBox('System: ' + data.message);
      } else if (data.type === 'analysis') {
        console.log('Analysis result received:', data.result);
        appendToChatBox('Analysis: ' + JSON.stringify(data.result));
      }
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocketRef.current?.close();
    };
  }, []);

  const appendToChatBox = (message: string) => {
    // Implement this function to append messages to your chatbox
    console.log(message);
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryData = event.target.result;
        websocketRef.current?.send(JSON.stringify({
          type: 'upload_cv',
          cv_data: Array.from(new Uint8Array(binaryData)),
        }));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
    }
  };

  const handleJobDescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setJobDescriptionFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryData = event.target.result;
        websocketRef.current?.send(JSON.stringify({
          type: 'analyze_jd',
          job_description: Array.from(new Uint8Array(binaryData)),
        }));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC, DOCX, or PDF file.");
    }
  };

  const handleStartInterview = () => {
    websocketRef.current?.send(JSON.stringify({
      type: 'start_interview',
      pdf_text: cvText,
      job_description: JD,
    }));
    console.log('Interview started');
  };

  const handleSendAnswer = (answer) => {
    websocketRef.current?.send(JSON.stringify({
      type: 'answer',
      answer: answer,
    }));
    appendToChatBox('You: ' + answer);
  };

  const handleEndInterview = () => {
    websocketRef.current?.send(JSON.stringify({
      type: 'end_interview',
    }));
  };

  const handleGetAnalysis = () => {
    websocketRef.current?.send(JSON.stringify({
      type: 'get_analysis',
    }));
  };

  const handleNextClick = () => {
    setStep(step + 1);
    if (allDevicesConfigured) {
      const newTab = window.open('/interviewPage', '_blank');
      if (newTab) {
        newTab.focus();
      }
    }
  };

  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription("");
  };

  const handleJobProfileSelect = (event) => {
    setSelectedJobProfile(event.target.value);
  };

  const handleCameraToggle = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  const handleSoundTest = () => {
    setIsSoundTesting(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleMicToggle = (e) => {
    setIsMicEnabled(e.target.checked);
    if (e.target.checked) {
      setIsMicTestEnabled(true);
    } else {
      setIsMicTestEnabled(false);
    }
  };

  const handleMicTestConfirmation = () => {
    setIsMicTestEnabled(false);
  };

  const handleSoundConfirmation = () => {
    setIsSoundEnabled(true);
    setIsSoundTesting(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, setFileFunction) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileFunction(file);
      handleResumeUpload({ target: { files: [file] } });
    }
  };

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId)?.click();
  };

  const handleSoundToggle = (e) => {
    setIsSoundEnabled(e.target.checked);
    if (e.target.checked) {
      setIsSoundTesting(true);
    } else {
      setIsSoundTesting(false);
    }
  };



  if (isInterviewStarted) {
    return <InterviewPage />; // Render the InterviewPage when the interview starts
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center w-[100%]">
      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="max-w-7xl w-full flex gap-8">
          {/* Left Section */}
          <div className="w-6/10 h-120 flex flex-col items-center justify-end bg-purple-600 text-white rounded-tl-3xl rounded-br-3xl p-10 relative">
            <div className="absolute inset-0 rounded-tl-3xl rounded-br-3xl overflow-hidden">
              <img src="/path_to_your_globe_image.svg" alt="Globe" className="w-full h-full object-cover opacity-50" />
            </div>
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. 
                <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 flex flex-col items-center justify-center bg-purple-50">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-semibold text-gray-800">Upload your latest CV/Resume</h3>
            </div>
            {/* Upload Section */}
            <div 
              className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, setResumeFile)}
            >
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-12 w-12 ${resumeFile ? 'text-purple-600' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4 18a2 2 0 012-2h8a2 2 0 012 2H4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">Drag & Drop or</p>
              <label
                htmlFor="resumeUpload"
                className="text-gray-500 cursor-pointer"
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
              <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
            </div>

            {/* Upload Button */}
            <button
              className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 transition mt-4"
              onClick={() => triggerFileInput('resumeUpload')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Upload Resume
            </button>

            {/* Display Uploaded File */}
            {resumeFile && (
              <div className="mt-4 text-center text-gray-700">
                <p>{resumeFile.name} uploaded successfully.</p>
              </div>
            )}

            <div className="mt-8 w-full px-4">
              <button 
                className={`w-full font-semibold py-3 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${resumeFile ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
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
        <div className="max-w-6xl w-full flex gap-8">
          {/* Left Section */}
          <div className="w-[80%] flex flex-col items-center justify-end bg-purple-600 text-white rounded-tl-3xl rounded-br-3xl p-10 relative">
            <div className="relative flex flex-col items-center mt-auto">
              <h2 className="text-xl font-bold text-center leading-snug">Take the wiZe AI mock Interview</h2>
              <p className="mt-2 text-center text-sm leading-relaxed">
                You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. 
                <span className="font-semibold"> All the best!</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 flex flex-col items-center justify-center bg-purple-50">
            <div className="w-full flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-2 w-full">
                {/* Progress Bar */}
                <div className="relative flex-1">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-purple-500 w-full z-0`}></div>
                </div>
                {/* Step 2 */}
                <div className="relative flex-1">
                  <div className={`w-8 h-8 ${jobDescriptionFile || isManualEntry ? 'bg-purple-500' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                    {(jobDescriptionFile || isManualEntry) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${jobDescriptionFile || isManualEntry ? 'bg-purple-500 w-full' : 'bg-gray-300 w-full'} z-0`}></div>
                </div>
                {/* Step 3 */}
                <div className="relative flex-1 flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-1/2 left-8 w-full h-0.5 bg-gray-300 z-0"></div>
                </div>
                {/* Step 4 */}
                <div className="relative flex-1 flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="text-purple-600 font-semibold mt-4">Get Started</div>
            </div>

            <div className="flex flex-col items-center justify-center w-full">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6">Choose your Interview Profile</h3>
              
              <div className="w-full flex justify-center mb-6">
                <button 
                  className={`px-6 py-2 font-semibold ${!isManualEntry ? 'text-white bg-purple-600' : 'text-purple-600 bg-gray-100'} rounded-l-lg focus:outline-none`}
                  onClick={handleUploadJDToggle}
                >
                  Upload JD
                </button>
                <button 
                  className={`px-6 py-2 font-semibold ${isManualEntry ? 'text-white bg-purple-600' : 'text-purple-600 bg-gray-100'} rounded-r-lg focus:outline-none`}
                  onClick={handleManualEntryToggle}
                >
                  Fill Manually
                </button>
              </div>

              {isManualEntry ? (
                <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                  <textarea
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-center placeholder:text-gray-500"
                    placeholder="Write or paste here complete job details (Word limit 1000 words)"
                    maxLength={1000}
                    value={manualJobDescription}
                    onChange={(e) => setManualJobDescription(e.target.value)}
                  />
                  <p className="text-gray-400 text-sm mt-2">Word limit 1000 words.</p>
                  <div className="w-full text-center mt-4">
                    <select 
                      value={selectedJobProfile} 
                      onChange={handleJobProfileSelect} 
                      className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-md shadow-md hover:bg-purple-600 focus:outline-none"
                    >
                      <option value="" disabled>Select Job Profile</option>
                      <option value="a">a</option>
                      <option value="b">b</option>
                      <option value="cd">cd</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, setJobDescriptionFile)}
                >
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-12 w-12 ${jobDescriptionFile ? 'text-purple-600' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4 18a2 2 0 012-2h8a2 2 0 012 2H4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">Drag & Drop or</p>
                  <label
                    htmlFor="jobDescriptionUpload"
                    className="text-gray-500 cursor-pointer"
                  >
                    Click to <span className="font-semibold text-gray-700">Upload Job Description</span>
                  </label>
                  <input
                    id="jobDescriptionUpload"
                    type="file"
                    accept=".doc,.docx,.pdf"
                    className="hidden"
                    onChange={handleJobDescriptionUpload}
                  />
                  <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
                </div>
              )}

              <div className="mt-8 w-full px-4">
                <button 
                  className={`w-full font-semibold py-3 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${(jobDescriptionFile || (isManualEntry && manualJobDescription)) ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
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
        </div>
      )}

      {/* Step 3: Configure Devices */}
      {step === 3 && (
        <div className="max-w-6xl w-full flex gap-8">
          {/* Left Section */}
          <div className="w-1/2 flex flex-col items-center justify-center bg-purple-600 text-white rounded-tl-3xl rounded-br-3xl p-10 relative">
            <video ref={videoRef} autoPlay className="w-full bg-black rounded-lg h-56 mb-6"></video>
            <div className="flex justify-between w-full text-sm mb-48">
              <span className="flex items-center">
                <FiMic className="w-5 h-5 mr-1" />
                Default - External Mic
              </span>
              <span className="flex items-center">
                <FiSpeaker className="w-5 h-5 mr-1" />
                Default - External Speaker
              </span>
              <span className="flex items-center">
                <FiVideo className="w-5 h-5 mr-1" />
                Default - Web Cam
              </span>
            </div>
            <p className="text-center text-sm leading-relaxed">
              Take the wiZe AI mock Interview
            </p>
            <p className="text-center text-sm mt-2 leading-relaxed">
              You'll be taking a 20-minute interview to have your skills evaluated. Just relax and take the interview. 
              <span className="font-semibold"> All the best!</span>
            </p>
          </div>

          {/* Right Section */}
          {!isMicTestEnabled && !isSoundTesting && (
            <div className="w-1/2 flex flex-col items-center justify-center bg-purple-50">
              <div className="w-full text-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-800">Ready to join? Configure Devices</h2>
              </div>

              <div className="w-full max-w-md flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiVideo className="h-6 w-6" />
                    Enable Camera
                  </span>
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isCameraEnabled}
                    onChange={handleCameraToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiMic className="h-6 w-6" />
                    Enable Microphone
                  </span>
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isMicEnabled}
                    onChange={handleMicToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiSpeaker className="h-6 w-6" />
                    Enable Speaker
                  </span>
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-6 w-6 text-purple-600"
                    checked={isSoundEnabled}
                    onChange={handleSoundToggle}
                  />
                </div>
              </div>

              <div className="mt-8 w-full px-4">
                <button 
                  className={`w-full font-semibold py-3 rounded-lg ${allDevicesConfigured ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                  disabled={!allDevicesConfigured}
                  onClick={handleNextClick}
                >
                  Next
                </button>
                <button 
                  className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {isMicTestEnabled && (
            <div className="w-1/2 flex flex-col items-center justify-center bg-purple-50">
              <div className="w-full px-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your microphone</h2>
                <div className="text-center mb-4">
                  <img src="/path_to_your_image.svg" alt="wiZe AI" className="mx-auto mb-2" />
                  <p className="text-gray-600">You're audible</p>
                </div>
                <audio ref={audioRef} src="/path_to_audio_file.mp3" className="hidden"></audio>
                <div className="relative mb-4">
                  <select className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option>Default - External Speaker</option>
                    <option>Default - Internal Speaker</option>
                    <option>Bluetooth Speaker</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                <button 
                  className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 transition"
                  onClick={handleMicTestConfirmation}
                >
                  My mic is working
                </button>
              </div>
            </div>
          )}

          {isSoundTesting && (
            <div className="w-1/2 flex flex-col items-center justify-center bg-purple-50">
              <div className="w-full px-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test your speakers</h2>
                <div className="text-center mb-4">
                  <img src="/path_to_your_image.svg" alt="wiZe AI" className="mx-auto mb-2" />
                  <p className="text-gray-600">You should hear a sound</p>
                </div>
                <audio ref={audioRef} src="/path_to_audio_file.mp3" className="hidden" autoPlay></audio>
                <div className="relative mb-4">
                  <select className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option>Default - External Speaker</option>
                    <option>Default - Internal Speaker</option>
                    <option>Bluetooth Speaker</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 underline cursor-pointer mb-4">Facing issues? Report here.</p>
                <button 
                  className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 transition"
                  onClick={handleSoundConfirmation}
                >
                  I can hear the sound
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResumePage;
