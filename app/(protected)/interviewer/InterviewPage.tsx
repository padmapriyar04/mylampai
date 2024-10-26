import { useCallback, useEffect, useRef, useState } from "react";
import Analysis from "./Analysis";
import OnlineCompiler from "./OnlineCompiler";
import { PiChatsThin } from "react-icons/pi";
import Image from "next/image";
import AudioToText from "./recording";
import {
  RiEmotionUnhappyLine,
  RiEmotionNormalLine,
  RiEmotionLine,
} from "react-icons/ri";
import { useWebSocketContext } from "@/hooks/interviewersocket/webSocketContext";

type ChatMessage = {
  user: string;
  message: string;
}

type InterviewPageProps = {
  isMicEnabled: boolean;
  // isSpeaking: boolean;
  // chatMessages: { user: string; message: string }[];
  // loading: boolean;
  // handleSendMessage: (message: string) => void;
  // analysisData: any;
}

const InterviewPage: React.FC<InterviewPageProps> = ({
  isMicEnabled,
  // isSpeaking,
  // chatMessages,
  // loading,
  // handleSendMessage,
  // analysisData,
}) => {
  const { ws } = useWebSocketContext();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCompiler, setShowCompiler] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackIconClicked, setFeedbackIconClicked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1200);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [textToSpeak, setTextToSpeak] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSendMessage = useCallback((message: string) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", message },
      ]);
      ws?.send(JSON.stringify({ type: "answer", answer: message }));
    }
  }, [ws])

  useEffect(() => {

    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {

          case "interview_question":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "Interviewer", message: data.question },
            ]);

            console.log("data: ", data.question);
            setLoading(false);
            setTextToSpeak(data.question);
            break;

          case "coding_question":
            ws.send(
              JSON.stringify({
                type: "coding",
                code: "This is a dummy response to the coding question.",
                ques: data.message,
              })
            );
            break;

          case "code_evaluation":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              {
                user: "System",
                message: "Code evaluation result: " + data.result,
              },
            ]);
            break;

          case "interview_end":
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "System", message: data.message },
            ]);
            break;

          case "analysis":
            setAnalysisData(data.result);
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { user: "Analysis", message: JSON.stringify(data.result) },
            ]);
            break;

          default:
            break;
        }
      }
    }

  }, [ws])

  const handleSpeak = useCallback(() => {
    console.log("hello speaking")
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [textToSpeak]);

  useEffect(() => {
    handleSpeak();
  }, [handleSpeak]);

  useEffect(() => {
    if (!loading && timeRemaining > 0 && !interviewEnded) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !interviewEnded) {
      setInterviewEnded(true);
      ws?.send(
        JSON.stringify({
          type: "get_analysis",
        }),
      );
      setShowFeedback(true);
    }
  }, [loading, ws, timeRemaining, interviewEnded]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };

    startVideoStream();

    const videoElement = videoRef.current;

    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleButtonClick = (index: number) => {
    setClickedIndex(index);
    setFeedbackIconClicked(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full h-full flex flex-col relative bg-primary-foreground">
      <nav className="flex items-center justify-between bg-white shadow-md p-4">
        <div className="flex gap-8">
          <div className="flex items-center justify-center">
            <Image
              src={"/home/logo.svg"}
              width={180}
              height={180}
              alt="wiZe Logo"
              className="h-auto w-48 ml-2"
            />
          </div>
          <div className="font-semibold text-xl flex justify-center items-center ">
            Technical Interview 1st round
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="bg-indigo-500 text-white px-4 py-3 rounded-full font-semibold ml-4"
            onClick={() => setShowCompiler(!showCompiler)} // Toggle the compiler modal (slide)
          >
            {showCompiler ? "Close Compiler" : "Open Online Compiler"}
          </button>
          <span className="text-gray-600 text-sm mr-4" id="status"></span>
          <button className="mr-6" onClick={() => setIsChatOpen(!isChatOpen)}>
            <PiChatsThin className="w-10 h-10 text-gray-600" />
          </button>
          <span className="text-gray-600 text-sm mr-4">
            Time Remaining: {formatTime(timeRemaining)}
          </span>

          <button
            className="bg-red-500 text-white px-4 py-3 rounded-full font-semibold"
            onClick={() => {
              setInterviewEnded(true);
              ws?.send(
                JSON.stringify({
                  type: "get_analysis",
                }),
              );
              setShowFeedback(true);
            }}
          >
            END INTERVIEW
          </button>
        </div>
      </nav>

      <div
        className={`flex-1 flex justify-items-center bg-primary-foreground overflow-hidden transition-all duration-300 ${isChatOpen ? "w-[80vw]" : "w-full"
          }`}
      >
        <video
          ref={videoRef}
          className="w-full  object-cover rounded-lg shadow-lg  relative"
          autoPlay
        />
      </div>

      {isMicEnabled && (
        <>
          <AudioToText onTextSubmit={handleSendMessage} isSpeaking={isSpeaking} />
        </>
      )}

      {isChatOpen && (
        <div className="absolute top-[5.7rem] right-6 bg-white border border-gray-300 shadow-lg rounded-xl w-[25vw] h-3/4 flex flex-col">
          <div className="flex justify-between items-center bg-primary text-white p-4 rounded-t-lg">
            <span className="font-semibold text-lg">Prompt Box</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div>
              {chatMessages.map((chat, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                  <span className="font-semibold">{chat.user}: </span>
                  <span>{chat.message}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-100 border-t border-b border-gray-300 rounded-lg">
            <input
              id="answerInput"
              type="text"
              placeholder="Type your answer here"
              className="w-full px-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none mb-4"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  const answer = target.value;
                  handleSendMessage(answer);
                  target.value = "";
                }
              }}
            />

            <div className="flex justify-between">
              <button
                id="sendAnswerButton"
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:ring-primary-foreground transition"
                onClick={() => {
                  const answer = (
                    document.getElementById("answerInput") as HTMLInputElement
                  ).value;
                  if (answer) {
                    handleSendMessage(answer);
                    (
                      document.getElementById("answerInput") as HTMLInputElement
                    ).value = "";
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

      {showFeedback && !feedbackSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-[40vw] min-w-[400px] min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 inline">
                A quick feedback and we&#39;ll guide you to your interview
              </h2>
              <h2 className="text-2xl font-bold mb-4 inline text-primary">
                {" "}
                Analysis!
              </h2>
            </div>
            <div className="flex flex-col justify-evenly">
              <div className="flex justify-evenly p-10 text-6xl">
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] hover:text-primary transition ${clickedIndex === 0 ? "text-primary scale-125" : ""
                    }`}
                  onClick={() => handleButtonClick(0)}
                >
                  <RiEmotionLine />
                </button>
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] transition hover:text-primary ${clickedIndex === 1 ? "text-primary scale-125" : ""
                    }`}
                  onClick={() => handleButtonClick(1)}
                >
                  <RiEmotionNormalLine />
                </button>
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] transition hover:text-primary ${clickedIndex === 2 ? "text-primary scale-125" : ""
                    }`}
                  onClick={() => handleButtonClick(2)}
                >
                  <RiEmotionUnhappyLine />
                </button>
              </div>

              <p className="mb-4">
                Please provide your feedback about the interview experience.
              </p>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none mb-4"
                placeholder="Your feedback here (optional)..."
              />
              <button
                className={`text-white px-4 py-3 rounded-lg font-semibold transition ${feedbackIconClicked
                  ? "bg-primary hover:bg-purple-600"
                  : "bg-gray-400"
                  }`}
                disabled={!feedbackIconClicked}
                onClick={() => {
                  setShowFeedback(false);
                  setFeedbackSubmitted(true);
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full min-w-[600px]">
            <Analysis analysisData={analysisData} />
          </div>
        </div>
      )}

      <div
        className={`fixed inset-y-0 right-0 w-3/4 bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${showCompiler ? "translate-x-0" : "translate-x-full"
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