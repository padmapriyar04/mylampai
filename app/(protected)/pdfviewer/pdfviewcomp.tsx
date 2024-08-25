"use client"
import React, { useState, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

function PDFHighlighter({ pdfFile }) {
  const [highlights, setHighlights] = useState([]);
  const viewerRef = useRef(null);

  const highlightPluginInstance = highlightPlugin({
    renderHighlights: (props) => (
      <div
        key={props.highlight.id}
        style={{
          backgroundColor: 'yellow',
          opacity: 0.5,
          position: 'absolute',
          left: `${props.highlight.position.left}%`,
          top: `${props.highlight.position.top}%`,
          width: `${props.highlight.position.width}%`,
          height: `${props.highlight.position.height}%`,
        }}
      />
    ),
    onHighlight: (highlight) => {
      setHighlights((prev) => [...prev, highlight]);
    },
  });

  const { highlightPluginProps } = highlightPluginInstance;

  return (
    <div>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={pdfFile}
          plugins={[highlightPluginInstance]}
          ref={viewerRef}
        />
      </Worker>
    </div>
  );
}

export default PDFHighlighter;
