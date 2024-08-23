"use client";
import React, { useState, DragEvent, ChangeEvent } from 'react';
import StepOneTwo from './StepOneTwo'; // Adjust the path if necessary
import { useInterviewStore } from '@/utils/store';
import StepThree from './StepThree';
import PDFViewer from './StepThree';
import { useUserStore } from '@/utils/userStore';
import { toast } from 'sonner';

const Page: React.FC = () => {
  const { setResumeFile, setJobDescriptionFile, resumeFile, jobDescriptionFile } = useInterviewStore();
  const [step, setStep] = useState(1);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualJobDescription, setManualJobDescription] = useState('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const { token } = useUserStore();
  const [profile, setProfile] = useState<string>("SOFTWARE");

  const handleDrop = (event: DragEvent<HTMLDivElement>, setFile: (file: File) => void) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      uploadCVAndJobDescription(file, manualJobDescription);
    }
  };

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      setResumeFile(file);
      uploadCVAndJobDescription(file, manualJobDescription);
    }
  };

  const triggerFileInput = (inputId: string) => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleNextClick = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBackClick = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleJobDescriptionUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const extractedText = await extractTextFromFile(file);
      if (extractedText) {
        setJobDescriptionFile(extractedText);
        await uploadCVAndJobDescription(resumeFile, extractedText);
      }
    }
  };

  const extractTextFromFile = async (file: File) => {
    // Assuming a similar function to extract text from PDF/DOC/DOCX
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch(`${baseUrl}/extract_text_from_file`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      return result.text || ''; // Adjust this depending on your API response structure
    } catch (error) {
      console.error("Error extracting text from file:", error);
      toast.error("Failed to extract text from file");
      return '';
    }
  };

  const handleManualEntryToggle = () => {
    setIsManualEntry(true);
    setJobDescriptionFile(null);
  };

  const handleUploadJDToggle = () => {
    setIsManualEntry(false);
    setManualJobDescription('');
  };

  const handleManualJDUpload = async () => {
    if (manualJobDescription.trim()) {
      await uploadCVAndJobDescription(resumeFile, manualJobDescription);
    }
  };
  console.log(token);

  
  const uploadCVAndJobDescription = async (resumeFile: string, jobDescriptionText: string) => {
    try {
      if (!token) {
        toast.error("Unauthorized");
        return;
      }
  
      // Convert the job description text to base64
      const jobDescriptionBase64 = btoa(jobDescriptionText); // `btoa` encodes a string to base64
  
      const response = await fetch("/api/interviewer/post_cv", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Resume: resumeFile, // Sending the resume file as base64 (assuming this is how it's being handled)
          JobDescription: jobDescriptionBase64, // Sending the job description text as base64
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
  

  console.log("structured Data", structuredData);

  return (
    <div>
      {step === 1 || step === 2 ? (
        <StepOneTwo
          step={step}
          setStep={setStep}
          handleDrop={handleDrop}
          handleResumeUpload={handleResumeUpload}
          triggerFileInput={triggerFileInput}
          handleDragOver={handleDragOver}
          handleNextClick={handleNextClick}
          handleBackClick={handleBackClick}
          handleJobDescriptionUpload={handleJobDescriptionUpload}
          handleManualEntryToggle={handleManualEntryToggle}
          handleUploadJDToggle={handleUploadJDToggle}
          handleManualJDUpload={handleManualJDUpload}
          isManualEntry={isManualEntry}
          manualJobDescription={manualJobDescription}
          setManualJobDescription={setManualJobDescription}
          setStructuredData={setStructuredData}
        />
      ) : step === 3 ? (
        <PDFViewer
          profile={profile}
          structuredData={structuredData}
        />
      ) : null}
    </div>
  );
};

export default Page;
