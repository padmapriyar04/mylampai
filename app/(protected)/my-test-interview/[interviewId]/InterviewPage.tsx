"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Analysis from "./analysis";
import OnlineCompiler from "./OnlineCompiler";
import { PiChatsThin } from "react-icons/pi";
import Image from "next/image";
import { handleAudioTranscribe } from "@/actions/transcribeAudioAction";
import { generateSasToken } from "@/actions/azureActions";
import FullScreenLoader from "@/components/global/FullScreenLoader";

import {
  RiEmotionUnhappyLine,
  RiEmotionNormalLine,
  RiEmotionLine,
} from "react-icons/ri";
import { useWebSocketContext } from "@/hooks/interviewersocket/webSocketContext";
import Caption from "./caption";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  user: string;
  message: string;
};

const InterviewPage = () => {
  const { ws } = useWebSocketContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCompiler, setShowCompiler] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackIconClicked, setFeedbackIconClicked] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [audioURL, setAudioURL] = useState("");
  const [caption, setCaption] = useState("");
  const [codingQuestion, setCodingQuestion] = useState("");

  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const elementRef = useRef(null);

  // const goFullscreen = () => {
  //   if (elementRef.current) {
  //     if (elementRef.current.requestFullscreen) {
  //       elementRef.current.requestFullscreen();
  //     } else if (elementRef.current.mozRequestFullScreen) {
  //       // Firefox
  //       elementRef.current.mozRequestFullScreen();
  //     } else if (elementRef.current.webkitRequestFullscreen) {
  //       // Chrome, Safari and Opera
  //       elementRef.current.webkitRequestFullscreen();
  //     } else if (elementRef.current.msRequestFullscreen) {
  //       // IE/Edge
  //       elementRef.current.msRequestFullscreen();
  //     }
  //   }
  // };

  // const exitFullscreen = () => {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.mozCancelFullScreen) {
  //     // Firefox
  //     document.mozCancelFullScreen();
  //   } else if (document.webkitExitFullscreen) {
  //     // Chrome, Safari and Opera
  //     document.webkitExitFullscreen();
  //   } else if (document.msExitFullscreen) {
  //     // IE/Edge
  //     document.msExitFullscreen();
  //   }
  // };

  // const toggleFullscreen = () => {
  //   if (!document.fullscreenElement) {
  //     goFullscreen();
  //   } else {
  //     exitFullscreen();
  //   }
  // };

  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim() !== "") {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { user: "You", message },
        ]);
        ws?.send(JSON.stringify({ type: "answer", answer: message }));
      }
    },
    [ws]
  );

  const handleInterviewer = useCallback(async (text: string) => {
    try {
      const res = await fetch("/api/synthesis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Network response was not okay");
      }
      const { audioResponse } = await res.json();
      const audioBuffer = new Uint8Array(audioResponse.data);
      const audioBlob = new Blob([audioBuffer], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      setAudioURL(audioUrl);
    } catch (error) {
      console.error("Error synthesising speech: ", error);
    }
  }, []);

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

            handleInterviewer(data.question);

            if (recognitionRef.current) recognitionRef.current.start();

            console.log("data: ", data.question);

            if (setLoading) setLoading(false);

            break;

          case "coding_question":
            setCodingQuestion(data.message);
            setShowCompiler(true);
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
      };
    }
  }, [ws, handleInterviewer]);

  const handleInterviewEnd = useCallback(() => {
    setInterviewEnded(true);
    ws?.send(
      JSON.stringify({
        type: "get_analysis",
      })
    );
    setShowFeedback(true);
  }, [ws]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (mediaRecorder && mediaStream) {
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            chunks.current.push(e.data);
          }
        };

        mediaRecorder.current.onstop = async () => {
          const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
          const url = URL.createObjectURL(recordedBlob);
          setRecordedUrl(url);
          chunks.current = [];

          const formData = new FormData();

          formData.append("audio", recordedBlob);

          try {
            const res = await handleAudioTranscribe(formData);

            if (res.status === "success" && res.transcript) {
              handleSendMessage(res.transcript);
            } else {
              startRecording();
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }
        };

        mediaRecorder.current.start();
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [handleSendMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }, []);

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

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log("User said:", result);
        setCaption(result);
      };

      recognition.onend = () => {
        console.log("Speech has ended");
        stopRecording();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      console.warn("SpeechRecognition is not supported by this browser.");
    }
  }, [stopRecording]);

  const handleButtonClick = (index: number) => {
    setClickedIndex(index);
    setFeedbackIconClicked(true);
  };

  useEffect(() => {
    if (audioURL && audioRef.current) {
      audioRef.current.src = audioURL;
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  }, [audioURL]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("ended", startRecording);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", startRecording);
      }
    };
  }, [audioURL, startRecording]);

  return (
    <div
      ref={elementRef}
      className="min-h-screen relative w-full h-full flex flex-col bg-primary-foreground items-center md:justify-center justify-top"
    >
      {loading && <FullScreenLoader />}

      {caption && <Caption text={caption} />}

      <nav className="sticky top-0 w-full z-10">
        <div className="flex items-center justify-between bg-white shadow-md p-4 w-full">
          <div className="flex gap-8">
            <Image
              src={"/home/logo.svg"}
              width={180}
              height={180}
              alt="wiZe Logo"
              className="h-auto w-48 ml-2"
            />
            <div className="font-semibold text-xl flex justify-center items-center ">
              Interview Round
            </div>
          </div>

          <div className="flex items-center">
            <button
              className="bg-primary text-white px-4 py-3 rounded-full font-semibold ml-4"
              onClick={() => setShowCompiler(!showCompiler)}
            >
              {showCompiler ? "Close Compiler" : "Open Online Compiler"}
            </button>
            <span className="text-gray-600 text-sm mr-4" id="status"></span>
            <button className="mr-6" onClick={() => setIsChatOpen(!isChatOpen)}>
              <PiChatsThin className="w-10 h-10 text-gray-600" />
            </button>
            <button
              className="bg-destructive text-white px-4 py-3 rounded-full font-semibold"
              onClick={handleInterviewEnd}
            >
              END INTERVIEW
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`flex flex-col justify-items-center bg-primary-foreground overflow-hidden transition-all duration-300 ${
          isChatOpen ? "w-[80vw]" : "w-full"
        }`}
      >
        <video
          ref={videoRef}
          className="w-full  object-cover rounded-lg shadow-lg  relative"
          autoPlay
        />
      </div>

      {audioURL && (
        <audio controls src={audioURL} ref={audioRef} className="hidden">
          Your browser does not support the audio element.
        </audio>
      )}

      <div>
        <audio controls src={recordedUrl}>
          Your browser does not support the audio element
        </audio>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>

      {isChatOpen && (
        <div className="absolute top-[5.7rem] right-6 bg-white border border-slate-500 shadow-lg rounded-xl w-[25vw] h-3/4 flex flex-col">
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

          <div className="p-4 bg-gray-100 border-t border-b border-slate-500 rounded-lg">
            <input
              id="answerInput"
              type="text"
              placeholder="Type your answer here"
              className="w-full px-4 py-4 border border-slate-500 rounded-full focus:ring-2 focus:ring-primary focus:outline-none mb-4"
            />

            <div className="flex justify-between">
              <button
                id="sendAnswerButton"
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
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

      {showFeedback && !feedbackSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-[40vw] min-w-[400px] min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 inline">
                A quick feedback and we&apos;ll guide you to your interview
              </h2>
              <h2 className="text-2xl font-bold mb-4 inline text-primary">
                {" "}
                Analysis!
              </h2>
            </div>
            <div className="flex flex-col justify-evenly">
              <div className="flex justify-evenly p-10 text-6xl">
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] hover:text-primary transition ${
                    clickedIndex === 0 ? "text-primary scale-125" : ""
                  }`}
                  onClick={() => handleButtonClick(0)}
                >
                  <RiEmotionLine />
                </button>
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] transition hover:text-primary ${
                    clickedIndex === 1 ? "text-primary scale-125" : ""
                  }`}
                  onClick={() => handleButtonClick(1)}
                >
                  <RiEmotionNormalLine />
                </button>
                <button
                  className={`hover:scale-110 hover:translate-y-[-10px] transition hover:text-primary ${
                    clickedIndex === 2 ? "text-primary scale-125" : ""
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
                className="w-full h-32 p-2 border border-slate-500 rounded-lg resize-none mb-4"
                placeholder="Your feedback here (optional)..."
              />
              <button
                className={`text-white px-4 py-3 rounded-lg font-semibold transition ${
                  feedbackIconClicked
                    ? "bg-primary hover:bg-primary"
                    : "bg-slate-500"
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

      <OnlineCompiler
        codingQuestion={codingQuestion}
        showCompiler={showCompiler}
        setShowCompiler={setShowCompiler}
      />
      
    </div>
  );
};

export default InterviewPage;
