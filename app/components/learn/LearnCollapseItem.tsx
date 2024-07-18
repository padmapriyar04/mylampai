"use client"
import { act, useState } from "react"
import LearnCollapseCard from "./LearnCollapseCard";
import Lessonsdiv from "./Lessonsdiv";
import useBooleanStore from "./store";
import React from "react";
import exp from "constants";

interface LearnCollapseItemProps {
    activeIndex: number;
    index: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

import { useModalStore } from "./store02";

const LearnCollapseItem: React.FC<LearnCollapseItemProps> = ({ activeIndex, setActiveIndex, index }) => {
    const setBooleanValue = useBooleanStore((state) => state.setBooleanValue);
    const booleanValue = useBooleanStore((state) => state.booleanValue);
  
    const handleClick = () => {
      const currentValue = useBooleanStore.getState().booleanValue;
      setBooleanValue(!currentValue);
      setActiveIndex((prevIndex) => (prevIndex === index ? 0 : index));
    };
    return (
        <>
            <div
                onClick={() => {
                    handleClick();
                }}
                className={`w-full h-14  md:w-full lg:h-20 border-[0.5px] flex sm:justify-between mb-7 rounded-md ${activeIndex === index
                    ? ' border-[#8C52FF] bg-white'
                    : ' border-gray-400 bg-[#E8E2F4]'

                    }`}
            >
                <div className="flex justify-between w-full  mx-5  items-center text-black xl:text-md sm:ml-5 sm:text-sm text-left h-full">
                    <div className={`${activeIndex === index? 'text-[#8C52FF]' : ''} `}>
                        <div className={`text-xs cursor-pointer  sm:text-sm lg:mb-[0.5px] mb-1 ${activeIndex === index? '' : 'text-[#737373]'}`}>Chapter 1</div>
                        <div className="sm:text-sm text-xs  ">Getting started with python</div>
                    </div>
                    <div className="my-3 mx-3 text-black">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`${activeIndex === index ? 'rotate-180' : 'rotate-0'} w-5 h-6 cursor-pointer`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </div>
                </div>

            </div>
        </>
    )
}

export default LearnCollapseItem;