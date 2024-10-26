import { useEffect, useState } from 'react';

interface AudioToTextProps {
  onTextSubmit: (text: string) => void;
  isSpeaking: boolean;
}

const AudioToText: React.FC<AudioToTextProps> = ({ onTextSubmit, isSpeaking }) => {
  const [finalText, setFinalText] = useState<string>('');
  let recognition: SpeechRecognition | null = null;

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimText = '';
        let tempFinalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            tempFinalText += transcriptSegment;
          } else {
            interimText += transcriptSegment;
          }
        }

        if (tempFinalText) {
          setFinalText(tempFinalText);
          onTextSubmit(tempFinalText); // Send final recognized text to parent component
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
          recognition?.start(); // Restart recognition if it stops and isSpeaking is true
        }
      };
    } else {
      alert("Your browser does not support Speech Recognition");
    }

    return () => {
      recognition?.stop(); // Stop recognition when the component unmounts
    };
  }, [isSpeaking, onTextSubmit]);

  useEffect(() => {

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

    if (isSpeaking) {
      startListening();
    } else {
      stopListening();
    }
  }, [isSpeaking]);

  return (
    <div className="absolute bottom-0 right-1/2 translate-x-1/2">
      {finalText}
    </div>
  );
};

export default AudioToText;
