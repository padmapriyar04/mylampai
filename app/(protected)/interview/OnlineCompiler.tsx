import React, { useState, useEffect } from 'react';
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

export default function OnlineCompiler() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(initialCode.cpp);
  const [output, setOutput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
          version: version,  // Ensure version is a valid string
          files: [
            {
              name: `main.${language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}`,  // Set appropriate file name
              content: code,
            },
          ],
        }),
      });
  
      const result = await response.json();
      setOutput(result.run.stdout || result.run.stderr);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-center text-white">Online Compiler</h1>
        <button
          onClick={toggleDarkMode}
          className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-lg"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Font Size Adjustments */}
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={decreaseFontSize}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded shadow"
        >
          A-
        </button>
        <button
          onClick={increaseFontSize}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded shadow"
        >
          A+
        </button>
      </div>

      {/* Main Layout for Editor and Output */}
      <div className="grid grid-cols-1 md:grid-cols-[70%,30%] gap-4 min-h-[calc(100vh-10rem)]">
        {/* Code Editor Section */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 shadow-2xl rounded-lg flex flex-col justify-between border border-gray-300 dark:border-gray-600">
          <div className="mb-6">
            <label htmlFor="language" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Choose Language:</label>
            <select
              id="language"
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(initialCode[e.target.value]);
              }}
              value={language}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 dark:bg-gray-700 dark:text-white"
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
            className="mt-6 py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Run Code
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 shadow-2xl rounded-lg flex flex-col justify-start border border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Output:</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-lg flex-1 overflow-auto transition-all duration-500 ease-in-out whitespace-pre-wrap border border-gray-300 dark:border-gray-600">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}

const CodeEditor = ({ language, code, setCode, fontSize }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setTheme(darkMode ? 'vs-dark' : 'light');
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains('dark');
      setTheme(darkMode ? 'vs-dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="editor-container">
      <Editor
        height="50vh"
        language={language}
        value={code}
        theme={theme}
        onChange={(value) => setCode(value)}
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
