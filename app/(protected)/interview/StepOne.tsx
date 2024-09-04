import React, { useState, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { IoDocumentAttach, IoCloudUploadOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';

interface StepOneProps {
  isResumeUploaded: boolean;
  resumeFile: File | null;
  isUploading: boolean;
  handleResumeUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, setResumeFile: React.Dispatch<React.SetStateAction<File | null>>) => void;
  handleDeleteResume: () => void;
  handleNextClick: () => void;
  handleBackClick: () => void;
}

const StepOne: React.FC<StepOneProps> = ({
  isResumeUploaded,
  resumeFile,
  isUploading,
  handleResumeUpload,
  handleDragOver,
  handleDrop,
  handleDeleteResume,
  handleNextClick,
  handleBackClick
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-[1200px] gap-4 w-full flex flex-col items-center md:flex-row justify-between">
      {/* Left Section */}
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
              className={`absolute top-1/2 left-8 h-0.5 transition-all duration-500 ease-in-out ${resumeFile ? "bg-primary w-full" : "bg-gray-400 w-full"} z-0`}
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

        <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] lg:max-h-[300px] shadow-lg text-center">
          <div className="flex items-center justify-center text-primary mb-5 relative top-0 text-3xl">
            <IoDocumentAttach />
          </div>

          {resumeFile ? (
            <div className="text-center text-gray-600 font-semibold relative h-[150px] flex items-center justify-center">
              Resume Uploaded: {resumeFile.name}
              <button
                className="absolute top-[44%] right-6 text-gray-600 hover:text-red-600 focus:outline-none"
                onClick={handleDeleteResume}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              className="border-dashed border-2 border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white h-[150px]"
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
                ref={fileInputRef}
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
              onClick={handleUploadClick}
              disabled={!!resumeFile || isUploading}
            >
              {isUploading ? "Uploading..." : resumeFile ? 'Resume Uploaded' : 'Upload Resume'}
            </button>
          </div>
        </div>

        <div className="mt-8 w-full px-4 flex flex-col items-center">
          <button
            className={`w-[40vw] xl:w-[32vw] md:max-w-[700px] h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${resumeFile ? "bg-gray-600 text-black hover:bg-gray-800 text-white" : "bg-gray-300 text-gray-800 cursor-not-allowed"}`}
            disabled={!resumeFile || isUploading}
            onClick={handleNextClick}
          >
            Next
          </button>
          <button
            className="bg-transparent text-gray-700 w-full font-semibold py-3 mt-2 rounded-lg hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition"
            onClick={handleBackClick}
            disabled={isUploading}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
