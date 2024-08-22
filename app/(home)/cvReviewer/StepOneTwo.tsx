"use client";
import React, { useState, useEffect, DragEvent, ChangeEvent } from "react";
import { IoDocumentAttach, IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { useInterviewStore } from "@/utils/store";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import { useUserStore } from "@/utils/userStore";
const baseUrl = "https://cv-judger.onrender.com";

interface StepOneTwoProps {
  step: number;
  setStep: (step: number) => void;
  handleDrop: (
    event: DragEvent<HTMLDivElement>,
    setFile: (file: File) => void,
  ) => void;
  handleResumeUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  triggerFileInput: (inputId: string) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleNextClick: () => void;
  handleBackClick: () => void;
  handleJobDescriptionUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleManualEntryToggle: () => void;
  handleUploadJDToggle: () => void;
  handleManualJDUpload: () => void;
  isManualEntry: boolean;
  manualJobDescription: string;
  setManualJobDescription: React.Dispatch<React.SetStateAction<string>>;
  setStructuredData: React.Dispatch<React.SetStateAction<any>>;
}

const StepOneTwo: React.FC<StepOneTwoProps> = ({
  step,
  setStep,
  handleDrop,
  triggerFileInput,
  handleDragOver,
  handleNextClick,
  handleBackClick,
  handleJobDescriptionUpload,
  handleManualEntryToggle,
  handleUploadJDToggle,
  handleManualJDUpload,
  isManualEntry,
  manualJobDescription,
  setManualJobDescription,
  setStructuredData,
}) => {
  const { resumeFile, setResumeFile, setExtractedText, jobDescriptionFile } =
    useInterviewStore();
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const {token} = useUserStore()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    setUploading(true);

    if (file && file.type === "application/pdf") {
        // Limiting the file size to 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            setUploading(false);
            return;
        }

        const fileReader = new FileReader();
        let extractedText = "";

        // This function is called when the file is fully loaded
        fileReader.onload = async function () {
            const typedArray: ArrayBuffer = new Uint8Array(this.result as ArrayBuffer);

            // Load the PDF document
            const pdf = await pdfjsLib.getDocument(typedArray).promise;

            // Loop through each page
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const textContent = await page.getTextContent();

                // Extract text
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");

                extractedText += pageText + "\n";
            }

            // Convert the file to base64
            const base64Reader = new FileReader();
            base64Reader.onloadend = async () => {
                const base64String = base64Reader.result?.toString().split(",")[1]; // Convert to base64 string

                if (base64String && extractedText) {
                    try {
                        setExtractedText(extractedText);
                        const structuredDataResult = await extractStructuredData(extractedText);

                        if (structuredDataResult) {
                            setStructuredData(structuredDataResult.message);
                        }

                        // Trigger the upload of CV and Job Description with base64 string and extracted text
                        await uploadCVAndJobDescription(base64String, extractedText);
                    } catch (err) {
                        toast.error("Failed to process the PDF");
                        console.error("Error:", err);
                    }
                } else {
                    toast.error("Error converting file to base64 or extracting text");
                }
            };
            base64Reader.readAsDataURL(file); // Start reading the file as a data URL
        };

        fileReader.readAsArrayBuffer(file);
    } else {
        toast.error("Please upload a PDF file");
        setUploading(false);
    }
};

  
  const extractTextFromPDF = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/extract_text_from_pdf`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return null;
    }
  };

  const uploadCVAndJobDescription = async (base64String: string, extractedText: string) => {
    try {
        if (!token) {
            toast.error("Unauthorized");
            return;
        }

        const response = await fetch("/api/interviewer/post_cv", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Resume: base64String, // Sending base64 string of the PDF
                JobDescription: extractedText || manualJobDescription, // Depending on whether it's a file or manual entry
            }),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success("CV and Job Description uploaded successfully");
            // Handle successful upload
        } else {
            toast.error(result.error || "Failed to upload CV and Job Description");
        }
    } catch (error) {
        toast.error("An error occurred while uploading CV and Job Description");
        console.error("Error:", error);
    }
};

  async function extractStructuredData(text: string) {
    try {
      const response = await fetch(`${baseUrl}/extract_structured_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cv_text: text }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsResumeUploaded(true);
        toast.success("Resume uploaded successfully");
        return result;
      }
      toast.error("Error extracting structured data from resume");
      return null;
    } catch (error) {
      toast.error("Error extracting structured data from resume");
      return null;
    }
  }

  return (
    <div className="md:h-[calc(100vh-4rem)] h-[140vh] bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee]">
      <div className="max-w-[1200px] gap-4 w-full flex flex-col items-center md:flex-row justify-between">
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
        {step === 1 && (
          <div className="w-full md:max-w-[500px] max-h-[89vh] scrollbar-hide overflow-hidden lg:max-w-[700px] overflow-x-hidden flex flex-col items-center justify-center bg-primary-foreground p-10 md:mr-8 lg:mr-0">
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
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                    resumeFile ? "bg-primary w-full" : "bg-gray-400 w-full"
                  } z-0`}
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
                  className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                    jobDescriptionFile || isManualEntry
                      ? "bg-primary w-full"
                      : "bg-gray-400 w-full"
                  } z-0`}
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

            {/* Upload Section */}
            <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] shadow-lg text-center">
              <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-3xl">
                <IoDocumentAttach />
              </div>

              <div
                className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, () => {})}
              >
                <p className="text-gray-500 mt-2 text-sm">Drag & Drop or</p>
                <label
                  htmlFor="resumeUpload"
                  className="text-gray-500 cursor-pointer text-sm"
                >
                  Click to{" "}
                  <span className="font-semibold text-gray-700 ">
                    Upload Resume
                  </span>
                </label>
                <input
                  id="resumeUpload"
                  type="file"
                  accept=".doc,.docx,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="text-4xl mt-3 text-gray-300">
                  <IoCloudUploadOutline />
                </div>

                <p className="text-gray-400 text-sm mt-3">
                  Supported file formats: PDF. File size limit 1 MB.
                </p>
              </div>

              {/* Upload Button */}
              <div className="flex justify-center mt-2">
                <button
                  className="bg-primary text-1vw md:w-[20vw] relative text-white font-bold py-3 px-3 rounded-xl hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
                  onClick={() => triggerFileInput("resumeUpload")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {isResumeUploaded
                    ? "Upload again"
                    : uploading
                      ? "Uploading..."
                      : "Upload Resume"}
                </button>
              </div>
            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw] xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-4 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
                  isResumeUploaded
                    ? "bg-gray-600 hover:bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-800 cursor-not-allowed"
                }`}
                disabled={!isResumeUploaded}
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
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
                    className={`w-8 h-8 ${resumeFile ? "bg-primary" : "bg-gray-400"} rounded-full flex items-center justify-center`}
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
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                      jobDescriptionFile || isManualEntry
                        ? "bg-primary w-full"
                        : "bg-gray-400 w-full"
                    } z-0`}
                  ></div>
                </div>
                {/* Step 2 */}
                <div className="relative flex-1">
                  <div
                    className={`w-8 h-8 ${
                      jobDescriptionFile || isManualEntry
                        ? "bg-primary"
                        : "bg-gray-400"
                    } rounded-full flex items-center justify-center`}
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
                    className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${
                      jobDescriptionFile || isManualEntry
                        ? "bg-primary w-full"
                        : "bg-gray-400 w-full"
                    } z-0`}
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

            <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] shadow-lg text-center">
              <div className="w-full flex justify-center mb-6">
                <button
                  className={`px-6 py-2 font-semibold ${!isManualEntry ? "text-white bg-primary" : "text-primary bg-gray-100"} rounded-lg focus:outline-none`}
                  onClick={handleUploadJDToggle}
                >
                  Upload JD
                </button>
                <button
                  className={`px-6 py-2 font-semibold ${isManualEntry ? "text-white bg-primary" : "text-primary bg-gray-100"} rounded-lg focus:outline-none`}
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
                  <p className="text-gray-400 text-sm mt-2">
                    Word limit 1000 words.
                  </p>
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
                <div
                  className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, () => {})}
                >
                  <div className="text-4xl mb-3 text-gray-300">
                    <IoCloudUploadOutline />
                  </div>
                  <p className="text-gray-500 mb-2">Drag & Drop or</p>
                  <label
                    htmlFor="jobDescriptionUpload"
                    className="text-gray-500 cursor-pointer"
                  >
                    Click to{" "}
                    <span className="font-semibold text-gray-700">
                      Upload Job Description
                    </span>
                  </label>
                  <input
                    id="jobDescriptionUpload"
                    type="file"
                    accept=".doc,.docx,.pdf"
                    className="hidden"
                    onChange={handleJobDescriptionUpload}
                  />
                  <p className="text-gray-400 text-sm mt-3">
                    Supported file formats: DOC, DOCX, PDF. File size limit 10
                    MB.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-8 w-full px-4 flex flex-col items-center">
              <button
                className={`w-[40vw] max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
                  jobDescriptionFile || (isManualEntry && manualJobDescription)
                    ? "bg-gray-600 hover:bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-800 cursor-not-allowed"
                }`}
                disabled={
                  !jobDescriptionFile &&
                  !(isManualEntry && manualJobDescription)
                }
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
        )}
      </div>
    </div>
  );
};

export default StepOneTwo;
