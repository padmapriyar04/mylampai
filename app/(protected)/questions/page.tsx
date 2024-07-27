"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Globe from "../../../public/images/Globe.svg";
import CarouselImage1 from "../../../public/images/Globe.svg";
import CarouselImage2 from "../../../public/images/Globe.svg";
import CarouselImage3 from "../../../public/images/Globe.svg";
import CarouselImage4 from "../../../public/images/Globe.svg";

interface Option {
  name: string;
  icon?: string;
}

interface SliderOption {
  name: string;
  min: number;
  max: number;
}

interface Page {
  question: string;
  options?: Option[] | Option[][];
  sliders?: SliderOption[];
  multiSelect?: boolean;
  gridLayout?: boolean;
}

const pages: Page[] = [
  {
    question: "Where do you want to study?",
    options: [
      { name: "India" },
      { name: "UK" },
      { name: "US" },
      { name: "Australia" },
      { name: "Canada" },
      { name: "Singapore" },
      { name: "France" },
      { name: "Germany" },
      { name: "New Zealand" },
    ],
    multiSelect: false,
    gridLayout: true,
  },
  {
    question: "What is your preferred area of study?",
    options: [
      [
        { name: "Business and Management" },
        { name: "Computer Science and IT" },
      ],
      [
        { name: "Engineering" },
        { name: "Social Science" },
        { name: "Architecture" },
      ],
      [{ name: "Professional Studies" }, { name: "Hospitality and Tourism" }],
      [
        { name: "Science" },
        { name: "Sports" },
        { name: "Fine Arts" },
        { name: "Law" },
      ],
      [{ name: "Education" }, { name: "Mathematics" }, { name: "Medicine" }],
      [{ name: "Journalism and Media" }, { name: "Agriculture and Forestry" }],
    ],
    multiSelect: true,
    gridLayout: false,
  },
  {
    question: "What degree do you want to pursue?",
    options: [{ name: "Bachelors" }, { name: "Masters" }],
    multiSelect: false,
    gridLayout: false,
  },
  {
    question: "What is your current education level?",
    options: [{ name: "12th" }, { name: "Bachelors" }, { name: "Masters" }],
    multiSelect: false,
    gridLayout: false,
    sliders: [
      { name: "Marks in %", min: 0, max: 100 },
      { name: "Backlogs", min: 0, max: 5 },
    ],
  },
  {
    question: "Which aptitude test did you take?",
    options: [
      { name: "GRE" },
      { name: "GMAT" },
      { name: "SAT" },
      { name: "ACT" },
    ],
    multiSelect: false,
    gridLayout: false,
    sliders: [{ name: "Score", min: 0, max: 340 }],
  },
  {
    question: "Which English test did you take?",
    options: [
      { name: "TOEFL" },
      { name: "IELTS" },
      { name: "PTE" },
      { name: "None" },
    ],
    multiSelect: false,
    gridLayout: false,
  },
];

const QuestionPage: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const router = useRouter();

  const currentPage = pages[currentPageIndex];

  const handleSelection = (option: string) => {
    if (currentPage.multiSelect) {
      setAnswers((prev) => ({
        ...prev,
        [currentPageIndex]: prev[currentPageIndex]
          ? prev[currentPageIndex].includes(option)
            ? prev[currentPageIndex].filter((item: string) => item !== option)
            : [...prev[currentPageIndex], option]
          : [option],
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [currentPageIndex]: option }));
    }
  };

  const handleSliderChange = (sliderIndex: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPageIndex]: { ...prev[currentPageIndex], [sliderIndex]: value },
    }));
  };

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      router.push("/studentDashboard");
    }
  };

  const isAnswerSelected = () => {
    const currentAnswer = answers[currentPageIndex];
    if (currentPage.multiSelect) {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    } else if (currentPage.sliders) {
      return (
        Object.keys(currentAnswer || {}).length === currentPage.sliders.length
      );
    } else {
      return !!currentAnswer;
    }
  };

  const renderButton = (option: Option, index: number) => (
    <button
      key={option.name}
      onClick={() => handleSelection(option.name)}
      className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105 text-lg ${
        (Array.isArray(answers[currentPageIndex]) &&
          answers[currentPageIndex]?.includes(option.name)) ||
        answers[currentPageIndex] === option.name
          ? "bg-purple-500 text-white"
          : "bg-white text-gray-700"
      }`}
    >
      {option.icon && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <Image src={option.icon} alt={option.name} width={24} height={24} />
        </div>
      )}
      <span>{option.name}</span>
    </button>
  );

  return (
    <div className="bg-purple-200 flex flex-col items-center justify-center min-h-screen h-screen relative p-4 md:p-0">
      <div className="hidden md:block absolute top-8 left-8 z-10">
        {/* Logo can be added here */}
      </div>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-7xl flex flex-col md:flex-row h-auto md:h-3/4">
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

        <div className="w-full md:w-2/3 p-4 md:p-12 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-6 bg-gray-100 p-10 rounded-4xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 ">
                {currentPage.question}
              </h2>

              {currentPage.gridLayout ? (
                <div className="grid grid-cols-3 gap-4">
                  {currentPage.options?.map(renderButton)}
                </div>
              ) : currentPage.options ? (
                <div className="space-y-4 flex flex-col items-center">
                  {currentPage.options.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex flex-wrap gap-4 justify-center"
                    >
                      {Array.isArray(row)
                        ? row.map((option, optionIndex) =>
                            renderButton(option, optionIndex)
                          )
                        : renderButton(row, rowIndex)}
                    </div>
                  ))}
                </div>
              ) : null}

              {currentPage.sliders && (
                <div className="space-y-4">
                  {currentPage.sliders.map((slider, index) => (
                    <div key={slider.name} className="space-y-2">
                      <label className="text-gray-700">{slider.name}</label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          min={slider.min}
                          max={slider.max}
                          step={1}
                          value={[
                            answers[currentPageIndex]?.[index] || slider.min,
                          ]}
                          onValueChange={([value]) =>
                            handleSliderChange(index, value)
                          }
                          className="flex-grow"
                        />
                        <input
                          type="number"
                          value={
                            answers[currentPageIndex]?.[index] || slider.min
                          }
                          onChange={(e) =>
                            handleSliderChange(index, Number(e.target.value))
                          }
                          className="w-16 p-1 border rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              onClick={() =>
                setCurrentPageIndex((prev) =>
                  prev < pages.length - 1 ? prev + 1 : prev
                )
              }
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-colors duration-300"
            >
              Skip
            </button>
            <button
              onClick={nextPage}
              disabled={!isAnswerSelected()}
              className={`bg-purple-500 text-white px-8 py-3 rounded-full transition-colors duration-300 hover:shadow-lg hover:transform hover:scale-105 text-lg ${
                !isAnswerSelected()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-600"
              }`}
            >
              {currentPageIndex === pages.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
