"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Globe from "../../../public/images/Globe.svg";
// import wiZe from "../../../public/header/wiZe.png";
import CarouselImage1 from "../../../public/images/Globe.svg";
import CarouselImage2 from "../../../public/images/Globe.svg";
import CarouselImage3 from "../../../public/images/Globe.svg";
import CarouselImage4 from "../../../public/images/Globe.svg";

const questions = [
  "What's your name?",
  "How old are you?",
  "What's your favorite color?",
  "Where are you from?",
  "What's your occupation?",
];

const QuestionPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Redirect to studentDashboard when all questions are answered
      router.push("/studentDashboard");
    }
  };

  return (
    <div className="bg-purple-200 flex flex-col items-center justify-center min-h-screen h-screen relative p-4 md:p-0">
      {/* Logo at the Top Left Corner */}
      <div className="hidden md:block absolute top-8 left-8 z-10">
        {/* <Image src={wiZe} alt="wiZe" className="" /> */}
      </div>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-7xl flex flex-col md:flex-row h-auto md:h-3/4">
        {/* Left Side with Carousel */}
        <div className="hidden md:block w-full md:w-1/3 bg-purple-500 rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 flex flex-col items-center justify-start mb-4 md:mb-0">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {[
                Globe,
                CarouselImage1,
                CarouselImage2,
                CarouselImage3,
                CarouselImage4,
              ].map((img, index) => (
                <CarouselItem key={index}>
                  <div className="flex justify-center items-center h-full">
                    <Image
                      src={img}
                      alt={`Carousel Image ${index}`}
                      className="w-4/5"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Right Side with Questions */}
        <div className="w-full md:w-2/3 p-4 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {questions[currentQuestionIndex]}
              </h2>
              <input
                type="text"
                className="w-full p-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                placeholder="Your answer"
              />
              <div className="flex justify-between">
                <button
                  onClick={nextQuestion}
                  className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish"
                    : "Done"}
                </button>
                <button
                  onClick={nextQuestion}
                  className="text-purple-500 hover:text-purple-700 transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Skip & Finish"
                    : "Skip"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
