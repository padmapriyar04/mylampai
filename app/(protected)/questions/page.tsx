"use client"
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import pageData from "./pageData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Globe from "../../../public/images/Globe.svg";

interface Option {
  name: string;
  icon?: string;
}

interface Page {
  question: string;
  multiSelect?: boolean;
  gridLayout?: boolean;
  options?: (Option | Option[])[];
  sliders?: { name: string; min: number; max: number }[];
}

const QuestionPage: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<number, { selection: string | string[]; sliders: Record<number, number> }>
  >({});
  const router = useRouter();

  const currentPage: Page = pageData[currentPageIndex];

  const handleSelection = (option: string) => {
    setAnswers((prev) => {
      const currentSelection = prev[currentPageIndex]?.selection || [];
      const isSelected = Array.isArray(currentSelection)
        ? currentSelection.includes(option)
        : currentSelection === option;

      const newSelection = currentPage.multiSelect
        ? isSelected
          ? (currentSelection as string[]).filter((item) => item !== option)
          : [...(currentSelection as string[]), option]
        : option;

      return {
        ...prev,
        [currentPageIndex]: {
          ...prev[currentPageIndex],
          selection: newSelection,
        },
      };
    });
  };

  const handleSliderChange = (sliderIndex: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPageIndex]: {
        ...prev[currentPageIndex],
        sliders: {
          ...(prev[currentPageIndex]?.sliders || {}),
          [sliderIndex]: value,
        },
      },
    }));
  };

  const nextPage = () => {
    if (currentPageIndex < pageData.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      router.push("/studentDashboard");
    }
  };

  const isAnswerSelected = () => {
    const currentAnswer = answers[currentPageIndex];
    if (currentPage.multiSelect) {
      return (
        Array.isArray(currentAnswer?.selection) &&
        currentAnswer.selection.length > 0
      );
    } else if (currentPage.sliders) {
      return (
        currentAnswer?.sliders &&
        Object.keys(currentAnswer.sliders).length === currentPage.sliders.length
      );
    } else {
      return !!currentAnswer?.selection;
    }
  };

  const renderButton = (option: Option, index: number) => (
    <button
      key={index}
      onClick={() => handleSelection(option.name)}
      className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105 text-lg ${
        (Array.isArray(answers[currentPageIndex]?.selection) &&
          answers[currentPageIndex]?.selection?.includes(option.name)) ||
        answers[currentPageIndex]?.selection === option.name
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
    <div className="bg-white flex flex-col items-center justify-center h-[calc(100vh-4rem)] relative p-4 md:p-0">
      <div className="hidden md:block absolute top-8 left-8 z-10">
        {/* Logo can be added here */}
      </div>

      <div className="bg-white backdrop-filter backdrop-blur-lg rounded-2xl p-4 transition-shadow duration-300 w-[95%] flex flex-col gap-32 md:flex-row h-[88%]">
        <div className="w-full lg:max-w-[800px] min-h-[550px] h-full md:max-w-[530px] md:w-[38vw] flex flex-col items-center justify-end bg-primary shadow-2xl text-white rounded-3xl p-10 relative">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {[Globe, Globe, Globe, Globe, Globe].map((img, index) => (
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

        <div className="w-full md:w-2/3 h-[600px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-9 min-h-[520px] bg-gray-200 shadow-lg p-10 rounded-4xl flex flex-col justify-evenly"
            >
              <h2 className="text-3xl font-bold text-gray-800">
                {currentPage.question}
              </h2>

              {currentPage.gridLayout ? (
                <div className="grid border-dashed border-2 p-10 rounded-3xl border-gray-400 grid-cols-3 gap-[1vw] relative">
                  {currentPage.options?.map((option, index) =>
                    renderButton(option as Option, index)
                  )}
                </div>
              ) : currentPage.options ? (
                <div className="space-y-4 flex flex-col items-center">
                  {currentPage.options.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex flex-wrap gap-[1vw] justify-center relative"
                    >
                      {Array.isArray(row)
                        ? (row as Option[]).map((option, optionIndex) =>
                            renderButton(option, optionIndex)
                          )
                        : renderButton(row as Option, rowIndex)}
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
                            answers[currentPageIndex]?.sliders?.[index] ||
                              slider.min,
                          ]}
                          onValueChange={([value]) =>
                            handleSliderChange(index, value)
                          }
                          className="flex-grow"
                        />
                        <input
                          type="number"
                          value={
                            answers[currentPageIndex]?.sliders?.[index] ||
                            slider.min
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

          <div className="flex flex-col justify-center gap-2 py-6">
            <button
              onClick={nextPage}
              disabled={!isAnswerSelected()}
              className={`w-full h-full text-lg font-bold py-6 rounded-lg focus:ring-4 focus:ring-gray-200 transition ${
                isAnswerSelected()
                  ? "bg-gray-600 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-800 cursor-not-allowed"
              }`}
            >
              {currentPageIndex === pageData.length - 1 ? "Finish" : "Next"}
            </button>

            <button
              onClick={() =>
                setCurrentPageIndex((prev) =>
                  prev < pageData.length - 1 ? prev + 1 : prev
                )
              }
              className="text-gray-800 text-lg py-2"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
