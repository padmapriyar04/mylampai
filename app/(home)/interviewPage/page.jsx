"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare } from "react-icons/fi";
import AudioToText from './Recording'; // Import the AudioToText component
import TextToSpeech from './Speech'; // Import the TextToSpeech component

// SectionA Component
const SectionA = ({ messages, handleSendMessage, isSpeaking, handleSpeak, handleStop, text, setText }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    <div>
      <h2 className="font-semibold text-lg mb-2">Text to Speech</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />
      <div className="flex justify-between">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          {isSpeaking ? "Speaking..." : "Speak"}
        </button>
        <button
          onClick={handleStop}
          disabled={!isSpeaking}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Stop
        </button>
      </div>
    </div>
    <hr className="my-4"/>
    {messages.map((chat, index) => (
      <div key={index} className="bg-gray-100 p-2 rounded-md">
        <span className="font-semibold">{chat.user}: </span>
        <span>{chat.message}</span>
      </div>
    ))}
  </div>
);

// SectionB Component
const SectionB = () => (
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    <AudioToText />
  </div>
);

const InterviewPage = () => {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat box visibility
  const [activeSection, setActiveSection] = useState("A"); // State to control which section is active
  const [chatMessagesA, setChatMessagesA] = useState([]); // State to hold chat messages for Section A
  const [text, setText] = useState(''); // State to hold text for Text-to-Speech
  const [isSpeaking, setIsSpeaking] = useState(false); // State to control speaking status

  const videoRef = useRef(null);

  useEffect(() => {
    // Countdown logic
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    // Access the user's camera
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    }
  }, []);

  // Format the time remaining as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSpeak = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      handleSendMessage("A", text); // Send the spoken text to the chat
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSendMessage = (section, message) => {
    if (message.trim() !== "") {
      if (section === "A") {
        setChatMessagesA([...chatMessagesA, { user: "You", message }]);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          <img src="/path_to_your_logo.svg" alt="wiZe Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold text-purple-600">wiZe</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 text-sm mr-4">
            {formatTime(timeRemaining)}
          </span>
          <button className="mr-4" onClick={() => setIsChatOpen(!isChatOpen)}>
            <FiMessageSquare className="w-6 h-6 text-gray-600" />
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            End Interview
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          autoPlay
          muted
        />
      </div>

      {/* Prompt Box */}
      {isChatOpen && (
        <div className="absolute top-20 right-6 bg-white border border-gray-300 shadow-lg rounded-lg w-96 h-1/2 flex flex-col">
          <div className="flex justify-between items-center bg-purple-600 text-white p-4 rounded-t-lg">
            <span className="font-semibold text-lg">Prompt Box</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Tabs for Sections */}
          <div className="flex bg-gray-200">
            <button
              className={`flex-1 py-2 text-center ${
                activeSection === "A"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700"
              } rounded-tl-lg`}
              onClick={() => setActiveSection("A")}
            >
              Section A
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeSection === "B"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700"
              } rounded-tr-lg`}
              onClick={() => setActiveSection("B")}
            >
              Section B
            </button>
          </div>

          {/* Sections A and B */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {activeSection === "A" ? (
              <SectionA
                messages={chatMessagesA}
                handleSendMessage={handleSendMessage}
                isSpeaking={isSpeaking}
                handleSpeak={handleSpeak}
                handleStop={handleStop}
                text={text}
                setText={setText}
              />
            ) : (
              <SectionB />
            )}
          </div>

          {/* Input Container */}
          <div className="p-4 bg-gray-100 border-t border-gray-300">
            <input
              type="text"
              placeholder={`I have a question for ${activeSection}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(activeSection, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
