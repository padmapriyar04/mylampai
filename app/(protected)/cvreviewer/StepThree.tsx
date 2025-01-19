"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewStore } from "@/utils/store";
import * as pdfjsLib from "pdfjs-dist/webpack";
import Image from "next/image";
import { useUserStore } from "@/utils/userStore";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Mark from "mark.js";
import "./highlight.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const baseUrl = "https://optim-cv-judge.onrender.com";

interface PDFViewerProps {
  profile: string | null;
  structuredData: any;
  localResume: any;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ profile }) => {
  const { userData } = useUserStore();
  const { extractedText, structuredData, resumeFile } = useInterviewStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  const [reviewedData, setReviewedData] = useState<any>({});
  const [isRendered, setIsRendered] = useState(false); // Define isRendered state
  const [isTextLayerReady, setIsTextLayerReady] = useState(false);

  const [sentencesToHighlight, setSentencesToHighlight] = useState<string[]>(
    []
  );

  const analyzeResume = useCallback(
    async (endpoint: string, data: any, query: string) => {
      try {
        const response = await fetch(`${baseUrl}${endpoint}${query}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) return result;
        return null;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    },
    []
  );

  const runAnalysis = useCallback(
    async (analysisType: string) => {
      setIsTextLayerReady(false);
      let endpoint = "";
      let data: any = {};
      let query = "";
      let result: any = null;

      if (textLayerRef.current) {
        const instance = new Mark(textLayerRef.current);
        instance.unmark();
      }

      switch (analysisType) {
        case "summary":
          if (!reviewedData.summary) {
            endpoint = "/summary";
            data = {
              cv_text: extractedText,
            };
            result = await analyzeResume(endpoint, data, query);

            if (!reviewedData.summary) {
              setReviewedData((prevData: any) => ({
                ...prevData,
                summary: result?.message,
              }));
            }
          }
          break;
        case "quantification_checker":
          if (!reviewedData.quantification_checker) {
            endpoint = "/quantification";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (result?.message?.["Not Quantify"]) {
              setSentencesToHighlight(result.message["Not Quantify"]);
              highlightSentences(
                result.message["Not Quantify"],
                "highlighted",
                false
              );
            }

            setReviewedData((prevData: any) => ({
              ...prevData,
              quantification_checker: result?.message,
            }));
          } else {
            console.log(
              "Sentences to highlight:",
              reviewedData.quantification_checker["Not Quantify"]
            );
            setSentencesToHighlight(
              reviewedData.quantification_checker["Not Quantify"]
            );
          }
          break;
        case "resume_score":
          if (!reviewedData.resume_score) {
            endpoint = "/job_description_resume_score";
            data = {
              cv_text: {
                cv_text: extractedText,
              },
              job_text: {
                job_text: profile,
              },
            };
            result = await analyzeResume(endpoint, data, query);
            if (!reviewedData.resume_score) {
              if (result?.message?.["Result"]) {
                setSentencesToHighlight(result.message["Result"]);
                highlightSentences(
                  result.message["Result"],
                  "highlighted",
                  false
                );
              }
              setReviewedData((prevData: any) => ({
                ...prevData,
                resume_score: result?.message,
              }));
            }
          }
          break;
        case "resume_length":
          if (!reviewedData.resume_length) {
            endpoint = "/resume_length";
            data = {
              text: extractedText,
              experience: "FRESHER",
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              resume_length: result?.message,
            }));
          }
          break;
        case "bullet_point_length":
          if (!reviewedData.bullet_point_length) {
            endpoint = "/bullet_point_length";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (!reviewedData.resume_score) {
              if (result?.message?.["Result"]) {
                setSentencesToHighlight(result.message["Result"]);
                highlightSentences(
                  result.message["Result"],
                  "highlighted",
                  false
                );
              }
            }
            setReviewedData((prevData: any) => ({
              ...prevData,
              bullet_point_length: result?.message,
            }));
          } else {
            setSentencesToHighlight(reviewedData.bullet_point_length.Result);
          }
          break;
        case "bullet_points_improver":
          if (!reviewedData.bullet_points_improver) {
            endpoint = "/bullet_points_improver";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (result?.message?.bulletPoints) {
              // Loop through each object in the bulletPoints array
              result.message.bulletPoints.forEach((bulletPoint: any) => {
                const textToHighlight = [bulletPoint.original]; // Wrap in array
                setSentencesToHighlight((prevState) => [
                  ...prevState,
                  ...textToHighlight,
                ]);
                highlightSentences(textToHighlight, "highlighted", false);
              });
            }
            setReviewedData((prevData: any) => ({
              ...prevData,
              bullet_points_improver: result?.message,
            }));
          } else {
            const bulletPoints =
              reviewedData.bullet_points_improver.bulletPoints;
            bulletPoints.forEach((bulletPoint: any) => {
              const textToHighlight = [bulletPoint.original]; // Wrap in array
              setSentencesToHighlight((prevState) => [
                ...prevState,
                ...textToHighlight,
              ]);
            });
          }
          break;
        case "total_bullet_points":
          if (!reviewedData.total_bullet_points) {
            endpoint = "/total_bullet_list";
            query = `?experience=FRESHER`;
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              total_bullet_points: result?.message,
            }));
          }
          break;
        case "verb_tense_checker":
          if (!reviewedData.verb_tense_checker) {
            endpoint = "/verb_tense";
            data = {
              extracted_data: structuredData,
            };
            query = "";
            result = await analyzeResume(endpoint, data, query);
            if (result?.message) {
              const sentencesToHighlight = Object.values(
                result.message
              ).flatMap((item: any) => item.correction);

              if (sentencesToHighlight.length > 0) {
                setSentencesToHighlight(sentencesToHighlight);
                highlightSentences(sentencesToHighlight, "highlighted", false);
              }
            }

            setReviewedData((prevData: any) => ({
              ...prevData,
              verb_tense_checker: result?.message,
            }));
          } else {
            const sentencesToHighlight = Object.values(
              reviewedData.verb_tense_checker
            ).flatMap((item: any) => item.correction);

            if (sentencesToHighlight.length > 0) {
              setSentencesToHighlight(sentencesToHighlight);
            }
          }
          break;
        case "weak_verb_checker":
          if (!reviewedData.weak_verb_checker) {
            endpoint = "/weak_verb_checker";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (result?.message) {
              const sentencesToHighlight = Object.keys(result.message);
              console.log("Sentences to Highlight:", sentencesToHighlight);

              if (sentencesToHighlight.length > 0) {
                setSentencesToHighlight(sentencesToHighlight);
                highlightSentences(sentencesToHighlight, "highlighted", false);
              } else {
                console.error("No sentences to highlight found.");
              }
            }

            setReviewedData((prevData: any) => ({
              ...prevData,
              weak_verb_checker: result?.message,
            }));
          } else {
            const sentencesToHighlight = Object.keys(
              reviewedData.weak_verb_checker
            );

            if (sentencesToHighlight.length > 0) {
              setSentencesToHighlight(sentencesToHighlight);
            }
          }
          break;
        case "section_checker":
          if (!reviewedData.section_checker) {
            endpoint = "/section_checker";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              section_checker: result.message,
            }));
          }
          break;
        case "skill_checker":
          if (!reviewedData.skill_checker) {
            endpoint = "/skill_checker";
            data = {
              extracted_data: structuredData,
            };
            query = `?profile=${profile}`;
            result = await analyzeResume(endpoint, data, query);
            if (result?.message?.["HARD"]) {
              setSentencesToHighlight(result.message["HARD"]);
              highlightSentences(result.message["HARD"], "highlighted", false);
            }
            if (result?.message?.["SOFT"]) {
              setSentencesToHighlight(result.message["SOFT"]);
              highlightSentences(result.message["SOFT"], "highlighted", false);
            }
            setReviewedData((prevData: any) => ({
              ...prevData,
              skill_checker: result?.message,
            }));
          } else {
            const hardSkills = reviewedData.skill_checker.HARD;
            const softSkills = reviewedData.skill_checker.SOFT;

            if (hardSkills.length > 0) {
              setSentencesToHighlight(hardSkills);
              highlightSentences(hardSkills, "highlighted", false);
            }
            if (softSkills.length > 0) {
              setSentencesToHighlight(softSkills);
              highlightSentences(softSkills, "highlighted", false);
            }
          }
          break;
        case "repetition_checker":
          if (!reviewedData.repetition_checker) {
            endpoint = "/repetition";
            data = {
              extracted_data: structuredData,
            };
            query = "";
            result = await analyzeResume(endpoint, data, query);
            if (result?.message) {
              const sentencesToHighlight = Object.values(
                result.message
              ).flatMap((item: any) => item.text);

              if (sentencesToHighlight.length > 0) {
                setSentencesToHighlight(sentencesToHighlight);
                highlightSentences(sentencesToHighlight, "highlighted", false);
              }
            }

            setReviewedData((prevData: any) => ({
              ...prevData,
              repetition_checker: result?.message,
            }));
          } else {
            const sentencesToHighlight = Object.values(
              reviewedData.repetition_checker
            ).flatMap((item: any) => item.text);

            if (sentencesToHighlight.length > 0) {
              setSentencesToHighlight(sentencesToHighlight);
            }
          }
          break;
        case "personal_info":
          if (!reviewedData.personal_info) {
            endpoint = "/personal_info";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              personal_info: result?.message,
            }));
          }
          break;
        case "responsibility_checker":
          if (!reviewedData.responsibility_checker) {
            endpoint = "/responsibility";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (result?.message) {
              const sentencesToHighlight = Object.values(
                result.message
              ).flatMap((item: any) => item?.correction);

              if (sentencesToHighlight.length > 0) {
                setSentencesToHighlight(sentencesToHighlight);
                highlightSentences(sentencesToHighlight, "highlighted", false);
              }
            }

            setReviewedData((prevData: any) => ({
              ...prevData,
              responsibility_checker: result?.message,
            }));
          } else {
            const sentencesToHighlight = Object.values(
              reviewedData.responsibility_checker
            ).flatMap((item: any) => item.correction);

            if (sentencesToHighlight.length > 0) {
              setSentencesToHighlight(sentencesToHighlight);
            }
          }
          break;
        case "spelling_checker":
          if (!reviewedData.spelling_checker) {
            endpoint = "/spelling_checker";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            if (result?.message?.["Result"]) {
              setSentencesToHighlight(result.message["Result"]);
              highlightSentences(
                result.message["Result"],
                "highlighted",
                false
              );
            }
            setReviewedData((prevData: any) => ({
              ...prevData,
              spelling_checker: result?.message,
            }));
          } else {
            setSentencesToHighlight(reviewedData.spelling_checker.Result);
          }
          break;
        default:
          console.log("Unknown analysis type");
          return;
      }
      setIsTextLayerReady(true);
    },
    [structuredData, extractedText, profile, reviewedData]
  );

  const highlightSentences = useCallback(
    (
      list_of_sentences: any,
      class_name: string,
      case_sensitive_flag: boolean
    ) => {
      const options_general = {
        ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
        separateWordSearch: false,
        accuracy: "partially" as any,
        className: class_name,
        acrossElements: true,
        caseSensitive: case_sensitive_flag,
      };

      // Ensure list_of_sentences is an array
      if (!Array.isArray(list_of_sentences)) {
        console.error(
          "Expected list_of_sentences to be an array, but got:",
          list_of_sentences
        );
        return;
      }

      list_of_sentences.forEach((sentence: string) => {
        if (typeof sentence === "string") {
          if (textLayerRef.current) {
            const normalizedSentence = sentence.trim().replace(/\s+/g, " ");
            const instance = new Mark(textLayerRef.current);
            instance.mark(normalizedSentence, options_general);
          }
        } else {
          console.warn("Skipping non-string sentence:", sentence);
        }
      });
    },
    []
  );

  const base64ToUint8Array = useCallback((base64: string): Uint8Array => {
    // Remove data URL prefix if present
    const base64Data = base64.split(",").pop();

    if (!base64Data) {
      throw new Error("Invalid base64 string");
    }

    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }, []);

  const renderPDF = useCallback(async () => {
    if (!resumeFile || !canvasRef.current) {
      console.error("Canvas reference is null or resumeFile is not set.");
      return;
    }
    try {
      const pdfData = base64ToUint8Array(resumeFile);
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;

      if (textLayerRef.current) {
        textLayerRef.current.innerHTML = "";

        const textContent = await page.getTextContent();
        textLayerRef.current.style.width = `${canvas.offsetWidth}px`;
        textLayerRef.current.style.height = `${canvas.offsetHeight}px`;

        await pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          textDivs: [],
        }).promise;

        setIsTextLayerReady(true);
      }
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
  }, [resumeFile, base64ToUint8Array]);

  const getColor = useCallback(
    (score: number | undefined) => {
      if (score === undefined) return "#FF0000";
      if (score < 50) return "#FF0000";
      if (score < 70) return "#FFA500";
      return "#00FF00";
    },
    [reviewedData.resume_score]
  );

  const getColorClass = useCallback(
    (score: number | undefined) => {
      if (score === undefined) return "text-red-500";
      if (score < 50) return "text-red-500";
      if (score < 70) return "text-yellow-500";
      return "text-green-500";
    },
    [reviewedData.resume_score]
  );

  useEffect(() => {
    if (resumeFile && !isRendered) {
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          renderPDF(); // Render the PDF using the resumeFile from interviewStore
          setIsRendered(true);
        }
      }, 100); // Delay to ensure the component is fully mounted

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [resumeFile]);

  useEffect(() => {
    if (isTextLayerReady) {
      highlightSentences(sentencesToHighlight, "highlighted", false);
    }
  }, [isTextLayerReady, sentencesToHighlight]);

  console.log("Reviewed Data:", reviewedData);

  useEffect(() => {
    runAnalysis("resume_score");
    runAnalysis("summary");
  }, []);

  return (
    <div className="flex h-full justify-between bg-primary-foreground items-stretch gap-2 px-2 pl-0">
      <div
        className="w-full bg-[#fafafa] rounded-tr-lg max-w-[220px] flex flex-col gap-2 "
        style={{
          boxShadow: "0px 0px 15px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          className={`w-full p-8 text-[1.6rem] font-semibold ${getColorClass(
            reviewedData.resume_score?.FINAL_SCORE
          )} rounded-lg`}
        >
          <CircularProgressbarWithChildren
            strokeWidth={6}
            value={
              reviewedData.resume_score
                ? reviewedData.resume_score.FINAL_SCORE.toFixed(1)
                : 0
            }
            styles={{
              path: {
                stroke: getColor(reviewedData.resume_score?.FINAL_SCORE),
                strokeLinecap: "round",
              },
            }}
          >
            {reviewedData.resume_score &&
              reviewedData.resume_score.FINAL_SCORE.toFixed(0)}
          </CircularProgressbarWithChildren>
        </div>
        <div className="h-full p-4 rounded-lg flex-grow">
          <h2 className="text-lg font-semibold">Resume Evaluation</h2>
          <div className="h-[1px] bg-slate-300 w-full mb-4"></div>
          <div className="flex flex-col w-full">
            <div className="flex items-center hover:bg-slate-200 duration-300 py-2 px-4 relative group rounded-md cursor-pointer ">
              <span className="font-medium">Hard Skill:</span>
              <span
                className={`ml-2 ${getColorClass(
                  reviewedData.resume_score?.DETAILS.HARD_SKILLS_SCORE?.score
                )}`}
              >
                {reviewedData.resume_score?.DETAILS.HARD_SKILLS_SCORE?.score ??
                  "N/A"}
                <div className="absolute right-0 min-h-full top-1/2 -translate-y-1/2 transform z-10 translate-x-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-white text-sm rounded">
                  {reviewedData.resume_score?.DETAILS.HARD_SKILLS_SCORE
                    ?.reason ?? "No details available"}
                </div>
              </span>
            </div>
            <div className="flex items-center hover:bg-slate-200 duration-300 py-2 px-4 relative group rounded-md cursor-pointer ">
              <span className="font-medium">Soft Skill:</span>
              <span
                className={`ml-2 ${getColorClass(
                  reviewedData.resume_score?.DETAILS.SOFT_SKILLS_SCORE?.score
                )}`}
              >
                {reviewedData.resume_score?.DETAILS.SOFT_SKILLS_SCORE?.score ??
                  "N/A"}
                <div className="absolute right-0 min-h-full top-1/2 -translate-y-1/2 transform z-10 translate-x-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-white text-sm rounded">
                  {reviewedData.resume_score?.DETAILS.SOFT_SKILLS_SCORE
                    ?.reason ?? "No details available"}
                </div>
              </span>
            </div>
            <div className="flex items-center hover:bg-slate-200 duration-300 py-2 px-4 relative group rounded-md cursor-pointer ">
              <span className="font-medium">Experience:</span>
              <span
                className={`ml-2 ${getColorClass(
                  reviewedData.resume_score?.DETAILS.EXPERIENCE_SCORE?.score
                )}`}
              >
                {reviewedData.resume_score?.DETAILS.EXPERIENCE_SCORE?.score ??
                  "N/A"}
                <div className="absolute right-0 min-h-full top-1/2 -translate-y-1/2 transform z-10 translate-x-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-white text-sm rounded">
                  {reviewedData.resume_score?.DETAILS.EXPERIENCE_SCORE
                    ?.reason ?? "No details available"}
                </div>
              </span>
            </div>
            <div className="flex items-center hover:bg-slate-200 duration-300 py-2 px-4 relative group rounded-md cursor-pointer ">
              <span className="font-medium">Education:</span>
              <span
                className={`ml-2 ${getColorClass(
                  reviewedData.resume_score?.DETAILS.EDUCATION_SCORE?.score
                )}`}
              >
                {reviewedData.resume_score?.DETAILS.EDUCATION_SCORE?.score ??
                  "N/A"}
                <div className="absolute right-0 min-h-full top-1/2 -translate-y-1/2 transform z-10 translate-x-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-white text-sm rounded">
                  {reviewedData.resume_score?.DETAILS.EDUCATION_SCORE?.reason ??
                    "No details available"}
                </div>
              </span>
            </div>
            {!reviewedData.resume_score && (
              <div className="text-sm text-gray-500">
                Scores are not available at the moment.{" "}
                <button
                  onClick={() => runAnalysis("resume_score")}
                  className="underline hover:text-primary"
                >
                  Please try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-2 py-4 rounded-lg h-[calc(100vh-5rem)] overflow-auto scrollbar-hide text-[#202020] ">
        <div>
          <h3 className="text-lg text-primary font-bold text-[#666]">
            Hello, {userData?.name?.trim().split(" ")[0] || "User"}!
          </h3>
          <p className="pl-2 text-[#888] font-semibold text-sm">
            Click on different parameters to get detailed analysis
          </p>
          <h2 className="text-xl font-bold mt-2">Summary</h2>
          <Dialog>
            <DialogTrigger className="px-4 py-2 bg-white shadow rounded-lg ">
              <div className="line-clamp-3 rounded-lg text-left text-sm font-medium text-[#333]">
                {reviewedData.summary && reviewedData.summary.Summary}
              </div>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>Summary</DialogTitle>
                <DialogDescription className="text-sm">
                  {reviewedData.summary && reviewedData.summary.Summary}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h2 className="text-xl font-bold h-full">Fixes or Corrections</h2>
          <div className="flex flex-wrap justify-between bg-[#fafafa] shadow rounded-lg items-start gap-y-4 gap-x-2 p-4 ">
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("quantification_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/2.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Quantification Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle>Quantification Checker</DialogTitle>
                  <DialogDescription className="">
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`item-1`}>
                        {reviewedData["quantification_checker"] && (
                          <AccordionTrigger>
                            Needs Quantification
                          </AccordionTrigger>
                        )}
                        {reviewedData["quantification_checker"] &&
                          reviewedData["quantification_checker"][
                            "Not Quantify"
                          ].map((data: string, index: number) => {
                            return (
                              <AccordionContent key={index}>
                                {data}
                              </AccordionContent>
                            );
                          })}
                      </AccordionItem>
                      <AccordionItem value={`item-2`}>
                        {reviewedData["quantification_checker"] && (
                          <AccordionTrigger>Quantified</AccordionTrigger>
                        )}
                        {reviewedData["quantification_checker"] &&
                          reviewedData["quantification_checker"][
                            "Quantify"
                          ].map((data: string, index: number) => {
                            return (
                              <AccordionContent key={index}>
                                {data}
                              </AccordionContent>
                            );
                          })}
                      </AccordionItem>
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("bullet_point_length")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/3.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Bullet Point Length
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle>Bullet Point Length</DialogTitle>
                  <DialogDescription>
                    {reviewedData.bullet_point_length &&
                    reviewedData.bullet_point_length.length === 0 ? (
                      reviewedData.bullet_point_length.Result.map(
                        (data: string, ind: number) => {
                          return <div key={ind}>{data}</div>;
                        }
                      )
                    ) : (
                      <div>Nothing to Show</div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("bullet_points_improver")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/4.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Bullet Points Improver
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Bullet Points Improver </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.bullet_points_improver &&
                        reviewedData.bullet_points_improver.bulletPoints.map(
                          (data: any, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                Original: {data.original}
                              </AccordionTrigger>
                              <AccordionContent>
                                Improved: {data.improved}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("total_bullet_points")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/5.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Total Bullet Points
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Total Bullet Points </DialogTitle>
                  <DialogDescription>
                    {reviewedData.total_bullet_points &&
                      reviewedData.total_bullet_points.Result}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("verb_tense_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/6.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Verb Tense Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Verb Tense Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.verb_tense_checker && (
                        <div>
                          {" "}
                          {Object.keys(reviewedData.verb_tense_checker).map(
                            (key, ind: number) => (
                              <AccordionItem
                                value={`item-${ind + 1}`}
                                key={ind}
                              >
                                <AccordionTrigger className="text-left">
                                  {key}
                                </AccordionTrigger>
                                <AccordionContent>
                                  Correction:{" "}
                                  {
                                    reviewedData.verb_tense_checker[key]
                                      .correction
                                  }
                                </AccordionContent>
                                <AccordionContent>
                                  Reason:{" "}
                                  {reviewedData.verb_tense_checker[key].reason}
                                </AccordionContent>
                                <AccordionContent>
                                  Impact:{" "}
                                  {reviewedData.verb_tense_checker[key].impact}
                                </AccordionContent>
                              </AccordionItem>
                            )
                          )}
                        </div>
                      )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("weak_verb_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/7.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Weak Verb Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Weak Verb Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.weak_verb_checker &&
                        Object.keys(reviewedData.weak_verb_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              <AccordionContent>
                                {reviewedData.weak_verb_checker[key].join(", ")}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("section_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/8.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Section Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Section Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.section_checker &&
                        Object.keys(reviewedData.section_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              <AccordionContent>
                                {reviewedData.section_checker[key]}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("skill_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/9.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Skill Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Skill Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.skill_checker &&
                        Object.keys(reviewedData.skill_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              <AccordionContent>
                                {reviewedData.skill_checker[key].join(", ")}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("repetition_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/10.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Repetition Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Repetition Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.repetition_checker &&
                        Object.keys(reviewedData.repetition_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              {key === "score" ? (
                                <AccordionContent>
                                  reviewedData.repetition_checker.score
                                </AccordionContent>
                              ) : (
                                <>
                                  <AccordionContent>
                                    {reviewedData.repetition_checker[key].text}
                                  </AccordionContent>
                                  <AccordionContent>
                                    {
                                      reviewedData.repetition_checker[key]
                                        .reason
                                    }
                                  </AccordionContent>
                                </>
                              )}
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("personal_info")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/11.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Personal Info
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogTitle> Personal Info </DialogTitle>
                <DialogDescription>
                  <Accordion type="single" collapsible>
                    {reviewedData.personal_info &&
                      Object.keys(reviewedData.personal_info).map(
                        (key, ind: number) => (
                          <AccordionItem value={`item-${ind + 1}`} key={ind}>
                            <AccordionTrigger className="text-left">
                              {key}
                            </AccordionTrigger>
                            <AccordionContent>
                              {reviewedData.personal_info[key]}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                  </Accordion>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("responsibility_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/12.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Responsibilty
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle> Responsibility Checker </DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible>
                      {reviewedData.responsibility_checker &&
                        Object.keys(reviewedData.responsibility_checker).map(
                          (key, ind: number) => (
                            <AccordionItem value={`item-${ind + 1}`} key={ind}>
                              <AccordionTrigger className="text-left">
                                {key}
                              </AccordionTrigger>
                              <AccordionContent>
                                Correction:{" "}
                                {
                                  reviewedData.responsibility_checker[key]
                                    .correction
                                }
                              </AccordionContent>
                              <AccordionContent>
                                Reason:{" "}
                                {
                                  reviewedData.responsibility_checker[key]
                                    .reason
                                }
                              </AccordionContent>
                            </AccordionItem>
                          )
                        )}
                    </Accordion>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary text-white rounded-lg font-semibold capitalize w-full min-h-[130px] flex items-center relative justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("spelling_checker")}
              >
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src="/cvreviewer/13.svg"
                    height={30}
                    width={30}
                    alt="icon"
                    className="-translate-y-5"
                  ></Image>
                  <div className="absolute top-[70px] w-full text-sm px-3 ">
                    {" "}
                    Spelling Checker
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] overflow-y-scroll scrollbar-hide max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle>Spelling Checker</DialogTitle>
                  <DialogDescription>
                    {reviewedData.spelling_checker &&
                      reviewedData.spelling_checker.Result.join(", ")}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className=" py-2">
        <div
          className="pdf-viewer-container shadow-lg rounded-md  overflow-hidden"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <div
            className="h-[calc(100vh-5rem)] max-w-[595px] overflow-auto scrollbar-hide"
            style={{ position: "relative", width: "100%" }}
          >
            <canvas ref={canvasRef} className={"pdfCanvas "} />
            <div ref={textLayerRef} className={"textLayer"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
