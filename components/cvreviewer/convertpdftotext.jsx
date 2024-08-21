import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PdfUploader = () => {
  const [textContent, setTextContent] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileReader = new FileReader();

      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let extractedText = '';

        // Loop through each page
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();

          // Extract text
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ');

          extractedText += pageText + '\n';
        }

        setTextContent(extractedText);
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div>
      <h1>Upload PDF to Extract Text</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <h3>Extracted Text:</h3>
      <pre>{textContent}</pre>
    </div>
  );
};

export default PdfUploader;
