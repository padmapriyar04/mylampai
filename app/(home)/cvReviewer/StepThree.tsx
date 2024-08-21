import React, { useEffect, useRef, useState } from 'react';
import useInterviewStore from '@/utils/store';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const PDFViewer = () => {
  const { resumeFile } = useInterviewStore();
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [atsScore, setAtsScore] = useState(56);  // Example ATS score
  const renderTaskRef = useRef(null);  // Keep track of the current render task

  useEffect(() => {
    const renderPDF = async () => {
      if (resumeFile && canvasRef.current) {
        let pdfData;

        if (typeof resumeFile === 'string') {
          pdfData = base64ToUint8Array(resumeFile);
        } else if (resumeFile instanceof Blob || resumeFile instanceof File) {
          pdfData = await resumeFile.arrayBuffer();
        } else if (resumeFile instanceof Uint8Array || resumeFile instanceof ArrayBuffer) {
          pdfData = resumeFile;
        }

        if (pdfData) {
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });

          loadingTask.promise.then((loadedPdf) => {
            setPdf(loadedPdf);
            setTotalPages(loadedPdf.numPages);
            renderPage(loadedPdf, pageNumber);
          }).catch((error) => {
            console.error('Error loading PDF:', error);
          });
        } else {
          console.error('No valid data found for the resumeFile');
        }
      }
    };

    const renderPage = async (pdf, pageNum) => {
      // Cancel any ongoing render task before starting a new one
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      renderTask.promise.then(() => {
        renderTaskRef.current = null;  // Clear the reference when done
      }).catch((error) => {
        if (error.name === 'RenderingCancelledException') {
          console.log('Rendering cancelled');
        } else {
          console.error('Render error:', error);
        }
      });
    };

    if (pdf) {
      renderPage(pdf, pageNumber);
    } else {
      renderPDF();
    }
  }, [resumeFile, pageNumber]);

  const handleNextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleAnalysisChange = (event) => {
    setSelectedAnalysis(event.target.value);
    runAnalysis(event.target.value);
  };

  const runAnalysis = (analysisType) => {
    console.log(`Running analysis: ${analysisType}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)] p-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg shadow-md flex items-center gap-4">
          <div className="relative w-16 h-16 flex justify-center items-center">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-yellow-500"
                 style={{ clipPath: `polygon(50% 0%, 100% 0%, 100% ${atsScore}%, 50% ${atsScore}%, 0% 100%, 0% 0%)` }}></div>
            <div className="absolute inset-0 w-full h-full rounded-full bg-white flex justify-center items-center">
              <span className="text-xl font-bold">{atsScore}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Keep improving!</h3>
            <p className="text-sm text-gray-600">Keep making recommended updates to your resume to reach a score of 75% or more.</p>
          </div>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg flex-grow shadow-md">
          <h2 className="text-xl font-bold ml-1">Options</h2>
          <select
            value={selectedAnalysis}
            onChange={handleAnalysisChange}
            className="bg-white border mt-2 border-gray-300 rounded-md px-2 py-3 w-full"
          >
            <option value="" disabled>Select Analysis</option>
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
            <option value="responsibility_checker">Responsibility In Words Checker</option>
            <option value="spelling_checker">Spelling Checker</option>
          </select>
        </div>
      </div>
      <div className="col-span-5 bg-white rounded-lg">
        <h2 className="text-2xl font-bold">Fixes or Corrections</h2>
      </div>
      <div className="col-span-4 bg-white rounded-lg h-full flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Uploaded CV Preview</h2>
        <canvas ref={canvasRef} className="w-full h-[75vh]"></canvas>
        <div className="flex justify-between">
          <button onClick={handlePrevPage} disabled={pageNumber <= 1} className={`px-4 py-2 bg-primary border-4 border-primary-foreground rounded-xl transition  ${ pageNumber >= totalPages ? 'hover:bg-purple-600' : 'bg-primary' }`}>
            Previous Page
          </button>
          <span>{pageNumber} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={pageNumber >= totalPages} className={`px-4 py-2 bg-primary border-4 border-primary-foreground rounded-xl transition ${ pageNumber <= 1 ? 'hover:bg-purple-600' : 'bg-primary' }`}>
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

