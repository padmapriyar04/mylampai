"use client";
import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/utils/store";
import * as pdfjsLib from "pdfjs-dist/webpack";
import "pdfjs-dist/web/pdf_viewer.css";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Card, CardContent } from "@/components/ui/card";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const baseUrl = "https://cv-judger.onrender.com";

interface PDFViewerProps {
  profile: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ profile }) => {
  const { resumeFile, extractedText, structuredData } = useInterviewStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const [atsScore, setAtsScore] = useState(80);

  async function analyzeResume(endpoint: string, data: any, query: string) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Analysis result:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  const runAnalysis = async (analysisType: string) => {
    let endpoint = "";
    let data: any = {};
    let query = "";

    switch (analysisType) {
      case "quantification_checker":
        endpoint = "/quantification";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "resume_length":
        endpoint = "/resume_length";
        data = {
          text: extractedText,
          experience: "FRESHER",
        };
        break;
      case "bullet_point_length":
        endpoint = "/bullet_point_length";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "bullet_points_improver":
        endpoint = "/bullet_points_improver";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "total_bullet_points":
        endpoint = "/total_bullet_list";
        query = `?experience=FRESHER`;
        data = {
          extracted_data: structuredData,
        };
        break;
      case "verb_tense_checker":
        endpoint = "/verb_tense";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "weak_verb_checker":
        endpoint = "/weak_verb_checker";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "section_checker":
        endpoint = "/section_checker";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "skill_checker":
        endpoint = "/skill_checker";
        data = {
          extracted_data: structuredData,
        };
        query = `?profile=${profile}`;
        break;
      case "repetition_checker":
        endpoint = "/repetition";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "personal_info":
        endpoint = "/personal_info";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "responsibility_checker":
        endpoint = "/responsibility";
        data = {
          extracted_data: structuredData,
        };
        break;
      case "spelling_checker":
        endpoint = "/spelling_checker";
        data = {
          extracted_data: structuredData,
        };
        break;
      default:
        console.log("Unknown analysis type");
        return;
    }

    const result = await analyzeResume(endpoint, data, query);
    console.log("Analysis Result:", result);
  };

  const handleOnClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnalysis(event.target.value);
    runAnalysis(event.target.value);
  };

  useEffect(() => {
    const renderPDF = async () => {
      if (resumeFile && canvasRef.current) {
        let pdfData: Uint8Array | ArrayBuffer | string | undefined;

        if (typeof resumeFile === "string") {
          pdfData = base64ToUint8Array(resumeFile);
        } else if (resumeFile instanceof Blob || resumeFile instanceof File) {
          pdfData = await resumeFile.arrayBuffer();
        } else if (
          resumeFile instanceof Uint8Array ||
          resumeFile instanceof ArrayBuffer
        ) {
          pdfData = resumeFile;
        }

        if (pdfData) {
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });

          loadingTask.promise
            .then(async (pdf) => {
              const page = await pdf.getPage(1);
              const viewport = page.getViewport({ scale: 1.5 });
              const canvas = canvasRef.current!;
              const context = canvas.getContext("2d")!;
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport,
              };

              await page.render(renderContext).promise;
            })
            .catch((error) => {
              console.error("Error loading PDF:", error);
            });
        } else {
          console.error("No valid data found for the resumeFile");
        }
      }
    };

    renderPDF();
  }, [resumeFile]);

  return (
    <div className="flex h-full justify-between items-stretch gap-2 p-2">
      <div className="w-full max-w-[250px] flex flex-col gap-2">
        <div className="bg-white w-full p-8 rounded-lg">
          <CircularProgressbarWithChildren
            strokeWidth={6}
            value={atsScore}
            styles={{ path: { stroke: "#8C52FF", strokeLinecap: "round" } }}
          >
            {atsScore}
          </CircularProgressbarWithChildren>
        </div>
        <div className="bg-white h-full p-4 rounded-lg flex-grow">
          <h2 className="text-xl font-bold">Options</h2>
          <div className="flex flex-col w-full gap-2 py-2">
            <div className="">Hard Skill: {90}</div>
            <div className="">Hard Skill: {90}</div>
            <div className="">Hard Skill: {90}</div>
            <div className="">Hard Skill: {90}</div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-2 rounded-lg">
        <h2 className="text-xl font-bold">Fixes or Corrections</h2>
        <select
          value={selectedAnalysis}
          onChange={handleOnClick}
          className="bg-white border border-gray-300 rounded-md p-2"
        >
          <option value="" disabled>
            Select Analysis
          </option>
          <option value="quantification_checker">Quantification Checker</option>
          <option value="resume_length">Resume Length</option>
          <option value="bullet_point_length">Bullet Point Length</option>
          <option value="bullet_points_improver">Bullet Points Improver</option>
          <option value="total_bullet_points">Total Bullet Points</option>
          <option value="verb_tense_checker">Verb Tense Checker</option>
          <option value="weak_verb_checker">Weak Verb Checker</option>
          <option value="section_checker">Section Checker</option>
          <option value="skill_checker">Skill Checker</option>
          <option value="repetition_checker">Repetition Checker</option>
          <option value="personal_info">Personal Info</option>
          <option value="responsibility_checker">
            Responsibility In Words Checker
          </option>
          <option value="spelling_checker">Spelling Checker</option>
        </select>

        <div className="flex flex-wrap justify-evenly gap-2 py-2">
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Quantification Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Bullet Point Length
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Bullet Points Improver
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Total Bullet Points
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Verb Tense Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Weak Verb Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Section Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Skill Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Repetition Checker
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Personal Info
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Responsibilty
        </button>
        <button className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full min-h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center ">
          Spelling Checker
        </button>
        </div>
      </div>
      <div className="w-full bg-primary rounded-lg">
        <h2 className="text-xl font-bold">Uploaded CV Preview</h2>
        <canvas ref={canvasRef} className="w-full h-auto max-h-full"></canvas>
      </div>
    </div>
  );
};

export default PDFViewer;
