"use client";
import React, { useState, DragEvent, ChangeEvent } from 'react';
import StepOneTwo from './StepOneTwo'; // Adjust the path if necessary
import { useInterviewStore } from '@/utils/store';
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
  const [localResume, setLocalResume] = useState<File | null>(null);

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
      setLocalResume(file);
      const resumeFileBinary = await getBinaryData(file); // Convert resume to binary
      uploadCVAndJobDescription(resumeFileBinary, manualJobDescription);
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

        // Read the resume file as binary
        const resumeFileBinary = await getBinaryData(resumeFile);

        // Now upload both resume (in binary) and job description
        await uploadCVAndJobDescription(resumeFileBinary, extractedText);
      }
    }
  };

  const getBinaryData = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Failed to read file as binary"));
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromFile = async (file: File) => {
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
      const resumeFileBinary = await getBinaryData(resumeFile); // Convert resume to binary
      await uploadCVAndJobDescription(resumeFileBinary, manualJobDescription);
    }
  };

  const uploadCVAndJobDescription = async (resumeFileBinary: ArrayBuffer, jobDescriptionText: string) => {
    try {
      if (!token) {
        toast.error("Unauthorized");
        return;
      }

      const jobDescriptionBase64 = btoa(jobDescriptionText);

      // Convert binary data to a Base64 string
      const resumeBase64 = Buffer.from(resumeFileBinary).toString('base64');

      const response = await fetch("/api/interviewer/post_cv", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Resume: resumeBase64, // Sending the resume file as base64
          JobDescription: jobDescriptionBase64, // Sending the job description text as base64
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("CV and Job Description uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload CV and Job Description");
      }
    } catch (error) {
      toast.error("An error occurred while uploading CV and Job Description");
      console.error("Error:", error);
    }
  };

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
          profile={profile}           // Pass the profile
          setProfile={setProfile}     // Pass the setProfile function
        />
      ) : step === 3 ? (
        <PDFViewer
          profile={profile}
          structuredData={structuredData}
          localResume={localResume} 
        />
      ) : null}
    </div>
  );
};

export default Page;