import { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '../../../utils/store';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const baseUrl = 'https://cv-judger.onrender.com';

async function analyzeResume(endpoint, data) {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log('Analysis result:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const PDFViewer: React.FC = () => {
  const { resumeFile, extractedText } = useInterviewStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [atsScore, setAtsScore] = useState(56);

  useEffect(() => {
    const renderPDF = async () => {
      if (resumeFile && canvasRef.current) {
        let pdfData: Uint8Array | ArrayBuffer | string | undefined;

        if (typeof resumeFile === 'string') {
          pdfData = base64ToUint8Array(resumeFile);
        } else if (resumeFile instanceof Blob || resumeFile instanceof File) {
          pdfData = await resumeFile.arrayBuffer();
        } else if (resumeFile instanceof Uint8Array || resumeFile instanceof ArrayBuffer) {
          pdfData = resumeFile;
        }

        if (pdfData) {
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });

          loadingTask.promise.then(async (pdf) => {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current!;
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport,
            };

            await page.render(renderContext).promise;
          }).catch((error) => {
            console.error('Error loading PDF:', error);
          });
        } else {
          console.error('No valid data found for the resumeFile');
        }
      }
    };

    renderPDF();
  }, [resumeFile]);

  const handleAnalysisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnalysis(event.target.value);
    runAnalysis(event.target.value);
  };

  const runAnalysis = async (analysisType: string) => {
    let endpoint = '';
    const data = { resume_text: extractedText };

    switch (analysisType) {
      case 'quantification_checker':
        endpoint = '/quantification';
        break;
      case 'resume_length':
        endpoint = '/resume_length';
        break;
      case 'bullet_point_length':
        endpoint = '/bullet_point_length';
        break;
      case 'bullet_points_improver':
        endpoint = '/bullet_points_improver';
        break;
      case 'total_bullet_points':
        endpoint = '/total_bullet_list';
        break;
      case 'verb_tense_checker':
        endpoint = '/verb_tense';
        break;
      case 'weak_verb_checker':
        endpoint = '/weak_verb_checker';
        break;
      case 'section_checker':
        endpoint = '/section_checker';
        break;
      case 'skill_checker':
        endpoint = '/skill_checker';
        break;
      case 'repetition_checker':
        endpoint = '/repetition';
        break;
      case 'responsibility_checker':
        endpoint = '/responsibility';
        break;
      case 'spelling_checker':
        endpoint = '/spelling_checker';
        break;
      default:
        console.log('Unknown analysis type');
        return;
    }

    const result = await analyzeResume(endpoint, data);
    console.log('Analysis Result:', result);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen p-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
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
        <div className="bg-gray-200 p-4 rounded-lg flex-grow">
          <h2 className="text-xl font-bold">Options</h2>
          <select
            value={selectedAnalysis}
            onChange={handleAnalysisChange}
            className="bg-white border border-gray-300 rounded-md p-2"
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
      <div className="col-span-5 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold">Fixes or Corrections</h2>
        {/* Fixes or corrections content */}
      </div>
      <div className="col-span-4 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold">Uploaded CV Preview</h2>
        <canvas ref={canvasRef} className="w-full h-auto"></canvas>
      </div>
    </div>
  );
};

export default PDFViewer;
