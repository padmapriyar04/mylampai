import React, { useState, useEffect } from 'react';

const AudioToText: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  let recognition: SpeechRecognition | null = null;

  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  } else {
    alert("Your browser does not support Speech Recognition");
  }

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
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
        setInterimTranscript(interimText);  // Set the interim transcript separately
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error detected: ", event.error);
      };
    }
  }, [recognition]);

  const startListening = () => {
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Audio to Text Converter</h2>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>{transcript}</p>
      <p style={{ color: 'gray' }}>{interimTranscript}</p>
    </div>
  );
};

export default AudioToText;