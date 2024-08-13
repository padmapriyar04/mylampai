"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare } from "react-icons/fi";

const InterviewPage = ({ websocketRef }) => {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat box visibility
  const [chatMessages, setChatMessages] = useState([]); // State to hold chat messages
  const videoRef = useRef(null);

  // WebSocket already established in UploadResumePage
  useEffect(() => {
    if (websocketRef.current) {
      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'interview_question') {
          setChatMessages((prevMessages) => [...prevMessages, { user: "Interviewer", message: data.question }]);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    return () => {
      // WebSocket cleanup if necessary
    };
  }, [websocketRef]);

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      setChatMessages((prevMessages) => [...prevMessages, { user: "You", message }]);
      websocketRef.current?.send(JSON.stringify({ type: "answer", answer: message }));
    }
  };

  // Countdown logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerInterval);
  }, []);

  // Format the time remaining as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-2">
            {chatMessages.map((chat, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md">
                <span className="font-semibold">{chat.user}: </span>
                <span>{chat.message}</span>
              </div>
            ))}
          </div>

          {/* Input Container */}
          <div className="p-4 bg-gray-100 border-t border-gray-300">
            <input
              type="text"
              placeholder="Type your answer here"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(e.target.value);
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
