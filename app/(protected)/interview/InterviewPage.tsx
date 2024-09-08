import React, { useEffect, useRef, useState } from 'react';
import AudioToText from './recording'; // Assuming you have an AudioToText component
import Analysis from './Analysis'; // Import the Analysis component
import OnlineCompiler from './OnlineCompiler'; // Import the OnlineCompiler component
import { PiChatsThin } from 'react-icons/pi'; // Assuming this icon is from react-icons, adjust as necessary.
import Link from "next/link";
import { RiEmotionUnhappyLine, RiEmotionNormalLine, RiEmotionLine } from "react-icons/ri";

interface InterviewPageProps {
  isMicEnabled: boolean;
  isSpeaking: boolean;
  isMicTestCompleted: boolean;
  chatMessages: { user: string; message: string }[];
  audioTextInputs: string[];
  loading: boolean;
  handleTextSubmit: (text: string) => void;
  handleSendMessage: (message: string) => void;
  websocketRef: React.MutableRefObject<WebSocket | null>;
  analysisData: any; // Analysis data is passed here
}

const InterviewPage: React.FC<InterviewPageProps> = ({
  isMicEnabled,
  isSpeaking,
  isMicTestCompleted,
  chatMessages,
  audioTextInputs,
  loading,
  handleTextSubmit,
  handleSendMessage,
  websocketRef,
  analysisData,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversation' | 'audioToText'>('conversation');
  const [showCompiler, setShowCompiler] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // State to show feedback pop-up
  const [feedbackIconClicked, setFeedbackIconClicked] = useState(false); // State for feedback icon click

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing video stream:', error);
      }
    };

    startVideoStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedback(true);
      setFeedbackIconClicked(true); // Mark feedback icon as clicked
    }, 20 * 60 * 1000); // 20 minutes in milliseconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full h-full flex flex-col relative bg-primary-foreground">
      <nav className="flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          <img src="/home/logo.svg" alt="wiZe Logo" className="h-auto w-48 ml-2" />
        </div>
        <div className="font-medium text-lg">Technical Interview 1st round</div>

        <div className="flex items-center">
          <button
            className="bg-primary text-white px-4 py-3 rounded-full font-semibold"
            onClick={() => {
              websocketRef.current?.send(
                JSON.stringify({
                  type: 'get_analysis', // Sending request to get analysis
                })
              );
            }}
          >
            VIEW ANALYSIS
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-3 rounded-full font-semibold ml-4"
            onClick={() => setShowCompiler(!showCompiler)} // Toggle the compiler modal (slide)
          >
            {showCompiler ? 'Close Compiler' : 'Open Online Compiler'}
          </button>
          <span className="text-gray-600 text-sm mr-4" id="status"></span>
          <button className="mr-6" onClick={() => setIsChatOpen(!isChatOpen)}>
            <PiChatsThin className="w-10 h-10 text-gray-600" />
          </button>
          <button
            className="bg-red-500 text-white px-4 py-3 rounded-full font-semibold"
            onClick={() => window.close()}
          >
            END INTERVIEW
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`flex-1 flex min-h-[100vh] justify-items-center bg-primary-foreground overflow-hidden transition-all duration-300 ${
          isChatOpen ? 'w-[80vw]' : 'w-full'
        }`}
      >
        <video
          ref={videoRef}
          className="w-full h-full max-w-screen max-h-screen object-cover rounded-lg shadow-lg transform scale-75 relative md:top-[-10vh] lg:top-[-6.5vh] xl:top-[-6vh]"
          autoPlay
          muted
        />
      </div>

      {isMicEnabled && (
        <AudioToText
          onTextSubmit={handleTextSubmit}
          isSpeaking={isSpeaking}
          isMicTestCompleted={isMicTestCompleted}
        />
      )}

      {isChatOpen && (
        <div className="absolute top-[5.7rem] right-6 bg-white border border-gray-300 shadow-lg rounded-xl w-[25vw] h-3/4 flex flex-col">
          <div className="flex justify-between items-center bg-primary text-white p-4 rounded-t-lg">
            <span className="font-semibold text-lg">Prompt Box</span>
            <button onClick={() => setIsChatOpen(false)} className="text-white text-2xl">
              &times;
            </button>
          </div>

          <div className="flex border-b border-gray-300 rounded-b-lg">
            <button
              className={`flex-1 text-center p-2 rounded-bl-lg ${
                activeTab === 'conversation' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('conversation')}
            >
              Conversation
            </button>
            <button
              className={`flex-1 text-center p-2 rounded-br-lg ${
                activeTab === 'audioToText' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('audioToText')}
            >
              Audio-to-Text
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {activeTab === 'conversation' && (
              <div>
                {chatMessages.map((chat, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                    <span className="font-semibold">{chat.user}: </span>
                    <span>{chat.message}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'audioToText' && (
              <div>
                {audioTextInputs.map((text, index) => (
                  <div key={index} className="bg-gray-200 p-2 rounded-md">
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 border-t border-b border-gray-300 rounded-lg">
            <input
              id="answerInput"
              type="text"
              placeholder="Type your answer here"
              className="w-full px-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  const answer = target.value;
                  handleSendMessage(answer);
                  target.value = '';
                }
              }}
            />

            <div className="flex justify-between">
              <button
                id="sendAnswerButton"
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition"
                onClick={() => {
                  const answer = (document.getElementById('answerInput') as HTMLInputElement).value;
                  if (answer) {
                    handleSendMessage(answer);
                    (document.getElementById('answerInput') as HTMLInputElement).value = '';
                  }
                }}
              >
                Send Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Feedback Pop-Up */}
      {
      showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-[40vw] min-w-[400px] min-h-[500px]">
            {feedbackIconClicked && (
              <Link
                className="absolute transition top-4 right-4 text-3xl font-bold text-white hover:text-primary-foreground"
                href="/analysis"
              >
                &times;
              </Link>
            )}
            <div className='text-center'>
            <h2 className="text-2xl font-bold mb-4 inline">A quick feedback and we'll guide you to your interview</h2>
            <h2 className="text-2xl font-bold mb-4 inline text-primary"> Analysis!</h2>
            </div>
            <div className='flex flex-col justify-evenly'>
              <div className='flex flex-col my-6'>
                <div>How was your experience?</div>
                <div className='flex justify-evenly p-10 text-6xl'>
                  <button onClick={() => setFeedbackIconClicked(true)}> <RiEmotionLine /> </button>
                  <button onClick={() => setFeedbackIconClicked(true)}> <RiEmotionNormalLine /> </button>
                  <button onClick={() => setFeedbackIconClicked(true)}> <RiEmotionUnhappyLine /> </button>
                </div>
              </div>

              <p className="mb-4">Please provide your feedback about the interview experience.</p>
              <textarea
                className="w-full h-20 p-2 border border-gray-300 rounded-lg resize-none mb-4"
                placeholder="Your feedback here(optional)..."
              />
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
                onClick={() => setShowFeedback(false)}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Online Compiler */}
      <div
        className={`fixed inset-y-0 right-0 w-3/4 bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${
          showCompiler ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative p-6">
          <button
           className="absolute right-4 mt-8 mr-4 py-2 px-4 text-sm md:text-base rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-lg"
            onClick={() => setShowCompiler(false)}
          >
            Close
          </button>
          <OnlineCompiler />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
