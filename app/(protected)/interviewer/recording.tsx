import { useEffect } from 'react';

interface AudioToTextProps {
  onTextSubmit: (text: string) => void;
  isSpeaking: boolean;
}

const AudioToText: React.FC<AudioToTextProps> = ({ onTextSubmit, isSpeaking }) => {
  let recognition: SpeechRecognition | null = null;

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

        if (finalText) {
          onTextSubmit(finalText); // Send final recognized text to parent component
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error detected:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert("Microphone access is blocked. Please allow access.");
        }
      };

      recognition.onend = () => {
        if (isSpeaking) {
          recognition.start(); // Restart recognition if it stops and isSpeaking is true
        }
      };
    }

    return () => {
      recognition?.stop(); // Stop recognition when the component unmounts
    };
  }, [recognition, isSpeaking, onTextSubmit]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  useEffect(() => {
    if (isSpeaking) {
      startListening();
    } else {
      stopListening();
    }
  }, [isSpeaking]);

  return (
    <div className="absolute bottom-0 right-1/2 translate-x-1/2">
    </div>
  );
};

export default AudioToText;