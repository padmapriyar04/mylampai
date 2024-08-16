import React, { useState, useEffect } from 'react';

const AudioToText = ({ onTextSubmit }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  let recognition = null;

  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  } else {
    alert("Your browser does not support Speech Recognition");
  }

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcriptSegment;
          } else {
            interimText += transcriptSegment;
          }
        }

        setTranscript((prev) => prev + finalText);
        setInterimTranscript(interimText);

        if (finalText) {
          onTextSubmit(finalText); // Send final recognized text to parent component
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error detected:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert("Microphone access is blocked. Please allow access.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Restart recognition if it stops
        }
      };
    }

    return () => {
      recognition?.stop(); // Stop recognition when the component unmounts
    };
  }, [recognition, isListening, onTextSubmit]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening]);

  useEffect(() => {
    setIsListening(true); // Start listening as soon as the component mounts
  }, []);

  return (
    <div></div>
  );
};

export default AudioToText;