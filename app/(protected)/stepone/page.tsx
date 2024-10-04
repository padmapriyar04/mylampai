"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CVUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    // Dynamically import pdfjs-dist when in the browser
    import("pdfjs-dist/build/pdf").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!pdfjsLib) {
      toast.error("PDF library not loaded yet!");
      return;
    }

    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size should be less than 1MB");
      return;
    }

    setUploading(true);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      let extractedText = "";
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        extractedText += pageText + "\n";
      }

      const base64Reader = new FileReader();
      base64Reader.onloadend = async () => {
        const base64String = base64Reader.result?.toString().split(",")[1];
        if (base64String && extractedText) {
          try {
            await uploadResume(base64String, extractedText);
          } catch (err) {
            toast.error("Failed to process the PDF");
            console.error("Error:", err);
          }
        } else {
          toast.error("Error converting file to base64 or extracting text");
        }
      };
      base64Reader.readAsDataURL(file);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const uploadResume = async (base64String: string, extractedText: string) => {
    try {
      const response = await fetch("https://cv-judger.onrender.com/job_description_resume_score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cv_text: {
            cv_text: extractedText,
          },
          job_text: {
            job_text: "Software Engineer",
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setResumeScore(result?.message?.FINAL_SCORE || 0);
        toast.success("Resume uploaded and scored successfully");
      } else {
        toast.error("Failed to score the resume");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading the resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Your CV</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        disabled={uploading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${uploading ? "cursor-not-allowed" : ""}`}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {resumeScore !== null && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Resume Score: {resumeScore}</h2>
        </div>
      )}
    </div>
  );
};

export default CVUploader;
