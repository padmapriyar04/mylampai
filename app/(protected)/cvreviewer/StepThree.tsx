"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewStore } from "@/utils/store";
import * as pdfjsLib from "pdfjs-dist/webpack";
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

const baseUrl =
  "https://ai-cv-review-b6ddhshaecbkcfau.centralindia-01.azurewebsites.net";

interface PDFViewerProps {
  profile: string | null;
  structuredData: any;
  localResume: any;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ profile }) => {
  const { userData } = useUserStore();
  const { extractedText, structuredData } = useInterviewStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [resumeFile, setResumeFile] = useState<Uint8Array | null>(null);
  const [reviewedData, setReviewedData] = useState<any>({});
  const [sentencesToHighlight, setSentencesToHighlight] = useState<string[]>(
    []
  );


  const fetchResumeFromLocalStorage = () => {
    try {
      const base64Data = localStorage.getItem("resumeFile");
      if (base64Data) {
        const byteString = atob(base64Data.split(',')[1]); // Decode base64 to binary string
        const uint8Array = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        setResumeFile(uint8Array);
      }
    } catch (error) {
      console.error("Error fetching resume from local storage:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeFromLocalStorage(); // Fetch the resume when the component mounts
  }, []);



  const analyzeResume = async (endpoint: string, data: any, query: string) => {
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
  };

  const runAnalysis = useCallback(
    async (analysisType: string) => {
      let endpoint = "";
      let data: any = {};
      let query = "";
      let result: any = null;

      switch (analysisType) {
        case "summary":
          if (!reviewedData.summary) {
            endpoint = "/summary";
            data = {
              cv_text: extractedText,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              summary: result?.message,
            }));
          }
          break;
        case "quantification_checker":
          if (reviewedData.quantification_checker) break;
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
            setReviewedData((prevData: any) => ({
              ...prevData,
              bullet_point_length: result?.message,
            }));
          }
          break;
        case "bullet_points_improver":
          if (!reviewedData.bullet_points_improver) {
            endpoint = "/bullet_points_improver";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              bullet_points_improver: result?.message,
            }));
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
            setReviewedData((prevData: any) => ({
              ...prevData,
              verb_tense_checker: result?.message,
            }));
          }
          break;
        case "weak_verb_checker":
          if (!reviewedData.weak_verb_checker) {
            endpoint = "/weak_verb_checker";
            data = {
              extracted_data: structuredData,
            };
            result = await analyzeResume(endpoint, data, query);
            setReviewedData((prevData: any) => ({
              ...prevData,
              weak_verb_checker: result?.message,
            }));
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
              highlightSentences(
                result.message["HARD"],
                "highlighted",
                false
              );
            }
            if (result?.message?.["SOFT"]) {
              setSentencesToHighlight(result.message["SOFT"]);
              highlightSentences(
                result.message["SOFT"],
                "highlighted",
                false
              );
            }
            setReviewedData((prevData: any) => ({
              ...prevData,
              skill_checker: result?.message,
            }));
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
            setReviewedData((prevData: any) => ({
              ...prevData,
              repetition_checker: result?.message,
            }));
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
            setReviewedData((prevData: any) => ({
              ...prevData,
              responsibility_checker: result?.message,
            }));
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
          }
          break;
        default:
          console.log("Unknown analysis type");
          return;
      }
    },
    [structuredData, extractedText, profile, reviewedData]
  );

  const highlightSentences = (
    list_of_sentences: any,
    class_name: any,
    case_sensitive_flag: any
  ) => {
    const options_general = {
      ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
      separateWordSearch: false,
      accuracy: "partially" as any,
      className: class_name,
      acrossElements: true,
      caseSensitive: case_sensitive_flag,
    };

    list_of_sentences.forEach((sentence: any) => {
      if (textLayerRef.current) {
        const instance = new Mark(textLayerRef.current); // Create a new Mark.js instance
        instance.mark(sentence, options_general);
      }
    });
  };

  // useEffect(() => {
  //   const fetchCVs = async () => {
  //     setLoading(true); // Start loading
  //     try {
  //       const response = await fetch("/api/interviewer/get_cv", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch CVs");
  //       }

  //       const data = await response.json();
  //       console.log('API Response:', data);  // Inspect the response

  //       // Check if the response contains the expected 'cv' object
  //       if (data.cv && data.cv.Resume) {
  //         const firstCV = data.cv; // Accessing the cv object

  //         const pdfData = base64ToUint8Array(firstCV.Resume); // Convert base64 to Uint8Array
  //         if (pdfData) {
  //           setResumeFile(pdfData);
  //         } else {
  //           console.error("Failed to convert base64 string to Uint8Array.");
  //         }
  //       } else {
  //         console.error("No valid CV found in the API response.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching CVs:", error);
  //     } finally {
  //       setLoading(false); // End loading
  //     }
  //   };

  //   fetchCVs();
  // }, [token]);

  //   const base64ToUint8Array = (base64: string): Uint8Array | null => {
  //   try {
  //     const cleanedBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  //     const raw = atob(cleanedBase64);
  //     const uint8Array = new Uint8Array(raw.length);
  //     for (let i = 0; i < raw.length; i++) {
  //       uint8Array[i] = raw.charCodeAt(i);
  //     }
  //     return uint8Array;
  //   } catch (error) {
  //     console.error("Failed to convert base64 string to Uint8Array:", error);
  //     return null;
  //   }
  // };

  const renderPDF = async () => {
    if (resumeFile && canvasRef.current) {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: resumeFile });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
  
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
  
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await page.render(renderContext).promise;
  
        // Render text layer
        if (textLayerRef.current) {
          textLayerRef.current.innerHTML = "";
  
          const textContent = await page.getTextContent();
          textLayerRef.current.style.width = `${canvas.offsetWidth}px`;
          textLayerRef.current.style.height = `${canvas.offsetHeight}px`;
  
          pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: textLayerRef.current,
            viewport: viewport,
            textDivs: [],
          }).promise.then(() => {
            highlightSentences(sentencesToHighlight, "highlighted", false);
          });
        }
      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    } else {
      console.error("Canvas reference is null or resumeFile is not set.");
    }
  };
  
  useEffect(() => {
    if (resumeFile) {
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          renderPDF();
        }
      }, 100); 

      return () => clearTimeout(timer); 
    }
  }, [resumeFile]);

  useEffect(() => {
    runAnalysis("resume_score");
    runAnalysis("summary");
  }, []);

  return (
    <div className="flex h-full justify-between items-stretch gap-2 p-2">
      <div className="w-full max-w-[250px] flex flex-col gap-2">
        <div className="bg-white w-full p-8 rounded-lg">
          <CircularProgressbarWithChildren
            strokeWidth={6}
            value={
              reviewedData.resume_score
                ? reviewedData.resume_score.FINAL_SCORE.toFixed(1)
                : 0
            }
            styles={{ path: { stroke: "#8C52FF", strokeLinecap: "round" } }}
          >
            {reviewedData.resume_score &&
              reviewedData.resume_score.FINAL_SCORE.toFixed(1) + "%"}
          </CircularProgressbarWithChildren>
        </div>
        <div className="bg-white h-full p-4 rounded-lg flex-grow">
          <h2 className="text-xl font-bold">Options</h2>
          <div className="flex flex-col w-full gap-2 py-2">
            <div className="">
              Hard Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.HARD_SKILLS_SCORE.score}
            </div>
            <div className="">
              Soft Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.SOFT_SKILLS_SCORE.score}
            </div>
            <div className="">
              Experience Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.EXPERIENCE_SCORE.score}
            </div>
            <div className="">
              Education Skill:{" "}
              {reviewedData.resume_score &&
                reviewedData.resume_score.DETAILS.EDUCATION_SCORE.score}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-2 rounded-lg h-[calc(100vh-5rem)] overflow-auto scrollbar-hide text-[#202020] ">
        <div>
          <h3 className="text-md font-semibold text-[#666]">
            Hello, {userData?.name?.trim().split(" ")[0] || "User"}
          </h3>
          <h2 className="text-xl font-bold">Summary</h2>
          <div
            className="px-2 mb-1 h-full overflow-auto scrollbar-hide max-h-[150px]"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          >
            {reviewedData.summary && reviewedData.summary.Summary}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold h-full">Fixes or Corrections</h2>
          <div className="flex flex-wrap justify-center items-start gap-2 py-2">
            <Dialog>
              <DialogTrigger
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("quantification_checker")}
              >
                Quantification Checker
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quantification Checker</DialogTitle>
                  <DialogDescription>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("bullet_point_length")}
              >
                Bullet Point Length
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("bullet_points_improver")}
              >
                Bullet Points Improver
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("total_bullet_points")}
              >
                Total Bullet Points
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("verb_tense_checker")}
              >
                Verb Tense Checker
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("weak_verb_checker")}
              >
                Weak Verb Checker
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("section_checker")}
              >
                Section Checker
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("skill_checker")}
              >
                Skill Checker
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("repetition_checker")}
              >
                Repetition Checker
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("personal_info")}
              >
                Personal Info
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("responsibility_checker")}
              >
                Responsibilty
              </DialogTrigger>
              <DialogContent>
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
                className="max-w-[140px] bg-primary rounded-lg font-semibold uppercase text-white w-full h-[130px] flex items-center justify-center shadow-lg hover:scale-[1.02] duration-200 text-center "
                onClick={() => runAnalysis("spelling_checker")}
              >
                Spelling Checker
              </DialogTrigger>
              <DialogContent>
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
      <div className="w-full bg-primary rounded-lg">
        {/* {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
            <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
          </div>
        ) : ( */}
        <div
          className="pdf-viewer-container"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <canvas ref={canvasRef} className={"pdfCanvas"} />
            <div ref={textLayerRef} className={"textLayer"} />
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default PDFViewer;
