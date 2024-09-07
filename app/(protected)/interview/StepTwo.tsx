import React, { useState, ChangeEvent, DragEvent } from 'react';
import { IoCloudUploadOutline, IoDocumentAttach } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import * as pdfjsLib from 'pdfjs-dist'; // Import pdfjs for parsing PDFs

interface StepTwoProps {
  JD: string;
  isResumeUploaded: boolean;
  isManualEntry: boolean;
  manualJobDescription: string;
  selectedJobProfile: string;
  jobProfiles: string[];
  setJD: (description: string) => void;
  handleManualJDUpload: () => void;
  handleNextClick: () => void;
  handleBackClick: () => void;
  setSelectedJobProfile: (profile: string) => void;
  setManualJobDescription: (description: string) => void;
  websocketRef: React.MutableRefObject<WebSocket | null>;
}

// Ensure you're using the correct version for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const StepTwo: React.FC<StepTwoProps> = ({
  JD,
  isResumeUploaded,
  isManualEntry,
  manualJobDescription,
  selectedJobProfile,
  jobProfiles,
  handleManualJDUpload,
  handleNextClick,
  handleBackClick,
  setSelectedJobProfile,
  setManualJobDescription,
  websocketRef,
  setJD,
}) => {
  const [showTextbox, setShowTextbox] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false); // Enable next button
  const [jdFile, setJDFile] = useState<File | null>(null); // Track JD file
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Helper function to extract text from PDF using pdf.js
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          text += ` ${pageText}`;
        }
        resolve(text.trim());
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
  };

  const handleJDUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJDFile(file);

      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file); // Use the helper to extract PDF text
      } else {
        extractedText = await file.text(); // Extract text content from non-PDF files
      }

      // Ensure WebSocket is initialized before sending
      if (extractedText && websocketRef?.current) {
        websocketRef.current.send(
          JSON.stringify({ type: 'analyze_jd', job_description: extractedText })
        );
        setJD("Uploaded"); // Update JD state
        setIsNextEnabled(true); // Enable Next button after JD upload
      } else {
        console.error('WebSocket is not initialized or extractedText is empty.');
      }
    }
  };

  // Handle JD drag-and-drop upload
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
        extractedText = await extractTextFromPDF(file); // Use helper to extract text from PDF
      } else {
        extractedText = await file.text(); // Extract text content from non-PDF files
      }

      if (extractedText) {
        websocketRef.current?.send(
          JSON.stringify({ type: 'analyze_jd', data: extractedText })
        );
        setJD("Uploaded"); // Update JD state
        setIsNextEnabled(true); // Enable Next button after JD drop
      }
    }
  };

  const handleProfileChange = (profile: string) => {
    setSelectedJobProfile(profile);

    // Show the textbox if "Other" is selected
    setShowTextbox(profile === 'Other');

    // If it's not "Other", send the selected profile directly as JD
    if (profile !== 'Other' && profile.trim() !== '') {
      setJD(profile);

      // Send the job profile as JD via WebSocket
      if (websocketRef.current) {
        websocketRef.current.send(
          JSON.stringify({
            type: 'analyze_jd',
            job_description: profile,
          })
        );
        console.log('JD sent via WebSocket:', profile);
      }

      setIsNextEnabled(true); // Enable Next button after profile selection
    } else {
      setIsNextEnabled(false); // Disable Next button if "Other" is selected but no manual entry
    }
  };

  // Handle manual JD entry
  const handleManualDescriptionChange = (description: string) => {
    setManualJobDescription(description);
    setIsNextEnabled(description.trim().length > 0); // Enable Next button if manual description is not empty
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-[1200px] gap-4 w-full flex flex-col items-center md:flex-row md:justify-between">
      {/* Left Section */}
      <div className="max-w-[450px] w-[90vw] md:mt-[8vh] md:w-[50vw] flex flex-col items-center justify-end bg-primary shadow-lg mt-[16vh] h-[62vh] md:h-auto ml-[5vw] mr-[5vw] md:m-10 text-white rounded-3xl p-10 relative">
        {/* Some content for left section */}
      </div>

      {/* Right Section */}
      <div className="w-full md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
        <h3 className="text-sm xl:text-2xl mb-6 font-bold text-gray-800">Choose your Interview Profile</h3>

        {/* Job Profile Section */}
        <div
          className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[280px] shadow-lg text-center flex flex-col items-center"
        >
          <select
            id="jobProfileDropdown"
            className="w-full p-4 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

          {/* Textbox for "Other" profiles */}
          {showTextbox && (
            <div className="w-full p-4 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center lg:max-h-[180px]">
              <textarea
                className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-center placeholder:text-gray-500 text-sm"
                placeholder="Write or paste here complete job details (Word limit 1000 words)"
                maxLength={1000}
                value={manualJobDescription}
                onChange={(e) => handleManualDescriptionChange(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-2">Word limit 1000 words.</p>
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

        {/* JD Upload Section */}
        <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[280px] shadow-lg text-center">
          <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-3xl">
            <IoDocumentAttach />
          </div>

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
            <div
              className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white h-[150px]"
              onDragOver={handleDragOver}
              onDrop={handleDrop} // Handle file drop
            >
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
                onChange={handleJDUpload} // Handle file input
              />

              <div className="text-4xl mt-3 text-gray-300">
                <IoCloudUploadOutline />
              </div>

              <p className="text-gray-400 text-sm mt-3">Supported file formats: DOC, DOCX, PDF. File size limit 10 MB.</p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-center mt-2">
            <button
              className={`bg-primary text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl ${
                jdFile ? 'cursor-not-allowed bg-gray-400' : 'hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition'
              }`}
              onClick={handleUploadClick} // Trigger file upload
              disabled={!!jdFile}
            >
              {jdFile ? 'JD Uploaded' : 'Upload JD'}
            </button>
          </div>
        </div>

        <div className="mt-8 w-full px-4 flex flex-col items-center">
          <button
            className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
              isNextEnabled ? 'bg-gray-600 hover:bg-gray-800 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'
            }`}
            disabled={!isNextEnabled}
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
  );
};

export default StepTwo;
