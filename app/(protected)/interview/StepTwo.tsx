import React, { useState, ChangeEvent, DragEvent, useCallback } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import * as pdfjsLib from 'pdfjs-dist';
import Image from 'next/image';
import { useWebSocketContext } from '@/hooks/webSocketContext';
import { toast } from 'sonner';

interface StepTwoProps {
  manualJobDescription: string;
  selectedJobProfile: string;
  setJD: (jd: string) => void;
  handleNextClick: () => void;
  handleBackClick: () => void;
  setSelectedJobProfile: (profile: string) => void;
  setManualJobDescription: (jd: string) => void;
  websocketRef: React.MutableRefObject<WebSocket | null>;
}

const StepTwo: React.FC<StepTwoProps> = ({
  manualJobDescription,
  selectedJobProfile,
  setJD,
  handleNextClick,
  handleBackClick,
  setSelectedJobProfile,
  setManualJobDescription,
  websocketRef,
}) => {
  const { ws } = useWebSocketContext();
  const [showTextbox, setShowTextbox] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(false); // New state to show upload box
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [jdFile, setJDFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);


  const jobProfiles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Business Analyst",
    "DevOps Engineer",
    "System Administrator",
  ];

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);

        // Check if we are in the browser environment
        if (typeof window !== 'undefined') {
          // Dynamically import pdfjs-dist for browser-only usage
          const pdfjsLib = await import('pdfjs-dist/build/pdf');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            text += ` ${pageText}`;
          }
          resolve(text.trim());
        } else {
          reject(new Error('pdfjs-dist is not available in the server environment'));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const checkMediaDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Media devices are not supported.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      console.log("Camera and microphone are enabled.");

      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();

      console.log("Audio tracks:", audioTracks);
      console.log("Video tracks:", videoTracks);

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error("Camera and/or microphone access denied.");
        } else if (error.name === 'NotFoundError') {
          toast.error("No media devices found.");
        } else {
          toast.error("Error accessing media devices:");
          console.log("Error accessing media devices: ", error)
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }, [])

  const handleJDUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJDFile(file);

      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      if (extractedText && ws) {
        ws.send(
          JSON.stringify({ type: 'analyze_jd', job_description: extractedText })
        );
        setJD("Uploaded");
        setIsNextEnabled(true);
      } else {
        console.error('WebSocket is not initialized or extractedText is empty.');
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setJDFile(file);

      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      if (extractedText && ws) {
        ws.send(
          JSON.stringify({ type: 'analyze_jd', data: extractedText })
        );
        setJD("Uploaded");
        setIsNextEnabled(true);
      }
    }
  };

  const handleProfileChange = (profile: string) => {
    setSelectedJobProfile(profile);

    if (profile === 'Upload JD as PDF') {
      setShowUploadBox(true);
      setShowTextbox(false);
    } else if (profile === 'Other') {
      setShowTextbox(true);
      setShowUploadBox(false);
    } else {
      setShowTextbox(false);
      setShowUploadBox(false);
      setJD(profile);

      if (ws) {
        ws.send(
          JSON.stringify({
            type: 'analyze_jd',
            job_description: profile,
          })
        );
        setIsNextEnabled(true);
      }
    }
  };

  const handleManualDescriptionChange = (description: string) => {
    setManualJobDescription(description);
    setIsNextEnabled(description.trim().length > 0);
  };

  return (
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
            <p className="text-2xl font-bold text-primary mb-2">Get Started!</p>
          </div>
          <div className="flex mx-auto items-center max-w-[450px] justify-center mb-2 w-full">
            {/* Progress Bar */}
            <div className="relative flex-1">
              <div className={`w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center`}>

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
              <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out bg-primary w-full z-0`}></div>
            </div>
            {/* Step 2 */}
            <div className="relative flex-1">
              <div
                className={`w-8 h-8 ${isNextEnabled ? 'bg-primary' : 'bg-gray-400'} rounded-full flex items-center justify-center`}
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
              <div className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${isNextEnabled ? 'bg-primary w-full' : 'bg-gray-400 w-full'} z-0`}></div>
            </div>
            {/* Step 3 */}
            <div className="relative flex items-center">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">Choose your Interview Profile</h3>

        {/* Combined Dropdown and Upload/Other Section */}
        <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[280px] shadow-lg text-center flex flex-col items-center">
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
            <option value="Upload JD as PDF">Upload JD as PDF</option>
            <option value="Other">Other</option>

          </select>

          {/* Show PDF upload box when selected */}
          {showUploadBox && (
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
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                  <p className="text-gray-500 mt-2 text-sm">Drag & Drop or</p>
                  <label htmlFor="jdUpload" className="text-gray-500 cursor-pointer text-sm">
                    Click to <span className="font-semibold text-gray-700">Upload Job Description</span>
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

                  <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
                </div>
              )}
            </div>
          )}

          {/* Show Textbox when "Other" selected */}
          {showTextbox && (
            <textarea
              value={manualJobDescription}
              onChange={(e) => handleManualDescriptionChange(e.target.value)}
              className="mt-4 p-4 border text-center flex items-center justify-center border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full transition"
              rows={5}
              placeholder="Please Enter Job Description (word limit is 1000 words)."
            />
          )}


        </div>
        <div className="flex flex-col justify-center items-center mt-6 w-full">

          <button
            onClick={handleNextClick}
            disabled={!isNextEnabled}
            className={`w-[40vw] xl:w-[32vw] md:max-w-[700px] lg:max-h-[70px] flex justify-center items-center h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition 
                ${isNextEnabled ? "bg-gray-600 text-white hover:bg-gray-800" : "bg-gray-300 text-gray-800 cursor-not-allowed"} rounded-full px-4 py-2`}
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
  );
};

export default StepTwo;
