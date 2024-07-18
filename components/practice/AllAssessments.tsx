"use client"
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";

interface AssessmentType {
  text: string;
  imgURL: string;
  description: {
    text: string;
    imgURL: string;
  }[];
}

const AllAssessments = (props: { allAssessements: AssessmentType[] }) => {
  const allAssessements = Array.isArray(props.allAssessements)
    ? props.allAssessements
    : [];

  const [activeIndex, setActiveIndex] = useState(-1);
  const activeDescRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex !== -1 && activeDescRef.current) {
      activeDescRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  const CardComponent = ({
    data,
    index,
  }: {
    data: AssessmentType;
    index: number;
  }) => {
    const { text, imgURL, description } = data;

    const handlePracticeClick = () => {
      if (index === activeIndex) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(index);
      }
    };
    return (
      <div className="flex flex-col w-full">
        <div
          style={{
            backgroundImage: "url('/allAssessmentsBG.JPG')",
            borderColor: index !== activeIndex ? "#FFFFFF" : "#8C52FF",
          }}
          className="h-[200px] rounded-lg shadow-lg bg-right-bottom bg-cover cursor-pointer border-2 hover:border-[#8C52FF] transition duration-500 relative"
        >
          <Image width={10} height={10} src={imgURL} className="absolute h-2/3 w-1/2 right-0 bottom-1/2 translate-y-1/2" alt="Card" />
          <div className="my-5 ml-5 h-[70%] flex flex-col items-start justify-between">
            <div className="font-bold text-2xl">{text}</div>
            <button
              className="bg-[#B175FF] rounded-3xl text-white py-1 pl-3 pr-1 flex items-center justify-center gap-2"
              onClick={handlePracticeClick}
            >
              <span>{index !== activeIndex ? "Practice4" : "3"}</span>
              <span className="bg-white rounded-full">
                {index !== activeIndex ? (
                  <IoIosArrowRoundForward className="text-black text-3xl rotate-45" />
                ) : (
                  <IoIosArrowRoundForward className="text-black text-3xl rotate-[225deg]" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="flex justify-between text-lg">
        <div className="font-bold">All Assessments</div>
        <button className="font-semibold text-[#8C52FF]">See All</button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-5">
        {allAssessements.map((value, index) => (
          <CardComponent key={index} data={value} index={index} />
        ))}
      </div>
      {activeIndex !== -1 &&
        allAssessements[activeIndex].description.length > 0 && (
          <div
            ref={activeDescRef}
            className="w-full bg-white mt-5 rounded-lg p-5 flex flex-col gap-4"
          >
            {allAssessements[activeIndex].description.map((d, descIndex) => (
              <div className="flex justify-around" key={descIndex}>
                <div className="bg-[#F1EAFF] rounded-full px-3 py-3 w-[65%] font-semibold text-gray-500 flex gap-5 items-center">
                  <div className="bg-[#8C52FF] rounded-full">
                    <Image alt="allAssessements" width={10} height={10} src={d.imgURL} className="rounded-full w-10 h-10" />
                  </div>
                  <div>{d.text}</div>
                </div>
                <button className="text-[#2561A1] border-2 border-[#8C52FF] rounded-full px-10 font-semibold hover:bg-[#8C52FF] hover:text-white transition-all duration-500">
                  Start Now
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

AllAssessments.defaultProps = {
  allAssessements: [],
};

export default AllAssessments;
