import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const initialCode = {
  javascript: 'console.log("hello");',
  python: 'print("hello")',
  cpp: `#include <iostream>

int main() {
    std::cout << "hello";
    return 0;
}`,
};


interface CodeEditorProps {
  language: string; // This could be 'javascript' | 'python' | 'cpp' if you want to restrict it
  code: string;
  setCode: (code: string) => void;
  fontSize: number;
}

type Language = 'javascript' | 'python' | 'cpp'; 

export default function OnlineCompiler() {
  const [language, setLanguage] = useState<Language>('cpp'); // Type the language state
  const [code, setCode] = useState(initialCode.cpp);
  const [output, setOutput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [isEditorVisible, setIsEditorVisible] = useState(true); // Controls editor visibility
  const [editorWidth, setEditorWidth] = useState(70); // Editor width in percentage

  const editorRef = useRef(null);
  const outputRef = useRef(null);

  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 30 ? prevSize + 2 : prevSize));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 10 ? prevSize - 2 : prevSize));
  };

  const runCode = async () => {
    let version;
    if (language === 'cpp') {
      version = '10.2.0'; // GCC version for C++
    } else if (language === 'python') {
      version = '3.10.0';  // Python version
    } else if (language === 'javascript') {
      version = '18.15.0'; // Known working JavaScript version
    }

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          version: version,
          files: [
            {
              name: `main.${language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}`,
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();
      setOutput(result.run.stdout || result.run.stderr);
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput('An unknown error occurred');
      }
    }
  };

  // Handler to close/hide the editor
  const closeEditor = () => {
    setIsEditorVisible(false);
  };

  // Function to handle resizing of editor width
  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-light-gray transition-colors duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800">Online Compiler</h1>
      </div>

      {isEditorVisible && (
        <>
          {/* Font Size Adjustments */}
          <div className="mb-4 flex justify-end space-x-2">
            <button
              onClick={decreaseFontSize}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              A-
            </button>
            <button
              onClick={increaseFontSize}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              A+
            </button>
          </div>

          {/* Main Layout for Editor and Output */}
          <div className="flex min-h-[calc(100vh-10rem)]">
            {/* Code Editor Section */}
            <div
              ref={editorRef}
              className="bg-white text-black p-4 md:p-6 shadow-2xl rounded-lg flex flex-col justify-between border border-gray-300"
              style={{ width: `${editorWidth}%` }}
            >
              <div className="mb-4">
                <label htmlFor="language" className="block text-lg font-semibold text-gray-700 mb-2">Choose Language:</label>
                <select
                  id="language"
                  onChange={(e) => {
                    const selectedLanguage = e.target.value as Language; // Type assertion here
                    setLanguage(selectedLanguage);
                    setCode(initialCode[selectedLanguage]); // Now TypeScript understands this
                  }}
                  value={language}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C/C++</option>
                </select>
              </div>

              {/* Code Editor Component */}
              <CodeEditor language={language} code={code} setCode={setCode} fontSize={fontSize} />

              <button
                onClick={runCode}
                className="mt-4 md:mt-6 py-2 md:py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Run Code
              </button>
            </div>

            {/* Resizer (Divider) */}
            <div
              className="bg-gray-500 w-1 cursor-col-resize"
              onMouseDown={handleMouseDown}
            ></div>

            {/* Output Section */}
            <div
              ref={outputRef}
              className="bg-white text-black p-4 md:p-6 shadow-2xl rounded-lg flex flex-col justify-start border border-gray-300"
              style={{ width: `${100 - editorWidth}%` }}
            >
              <h2 className="text-2xl font-semibold mb-2 md:mb-4 text-gray-700">Output:</h2>
              <pre className="bg-gray-100 text-black p-3 md:p-4 rounded-lg flex-1 overflow-auto transition-all duration-500 ease-in-out whitespace-pre-wrap border border-gray-300">
                {output}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, setCode, fontSize }) => {
  return (
    <div className="editor-container">
      <Editor
        height="50vh"
        language={language}
        value={code}
        theme="light"
        onChange={(value) => setCode(value || '')} // Ensure that value is not undefined
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          fontFamily: 'Fira Code, monospace',
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
