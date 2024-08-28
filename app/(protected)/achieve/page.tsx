"use client"
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import Link from "next/link";
import { RiComputerLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";



const HandleInterviewClick = () => {
  toast.success("This feature coming soon!");
};

export default function Achieve() {
  return (
    <div className="bg-primary-foreground w-full gap-4 p-4 md:grid md:grid-cols-2 md:grid-rows-12 max-h-[calc(100vh-4rem)] flex flex-col">
      <div className="w-full bg-white rounded-lg row-span-8 h-full shadow-lg justify-center items-center flex flex-col gap-[1vw] max-h-[40vh] md:max-h-[80vh]">
        <div className="h-full flex flex-col justify-evenly items-center">
        <HiOutlineDocumentCheck className="md:h-20 md:w-20 md:border-2 border-primary rounded-full md:p-[1vw] text-primary mt-4 text-8xl my-8" />
        <div className="font-bold md:text-3xl text-2xl">
          <h1>AI CV Reviewer 2.0</h1>
        </div>
        <div className="text-center font-semibold text-lg text-gray-500 px-12">
          <p>
            Enhance your resume with out AI-powered CV review for personalized
            feedback and optimization tips.
          </p>
        </div>
        <div className="flex flex-row justify-evenly relative top-[3vh] gap-2 w-full md:px-[1vw] pb-8 md:mt-16 md:gap-6 px-[2vw] ">
          <Link
            href="#"
            className="bg-white py-2 md:py-5 px-3 w-1/2 font-semibold text-primary md:text-xl rounded-lg border-2 border-primary text-center max-h-[60px] items-center flex justify-center hover:bg-primary hover:text-white transition"
          >
            Past Analysis
          </Link>
          <Link
            href="/cvreviewer"
            className="bg-primary  py-2 md:py-5 px-3 w-1/2 font-semibold text-white md:text-xl rounded-lg border-2 border-primary text-center max-h-[60px] items-center flex justify-center hover:bg-purple-600 transition"
          >
            Get CV Reviewed
          </Link>
        </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg row-span-8 h-full shadow-lg justify-center items-center flex flex-col gap-[1vw] max-h-[40vh] md:max-h-[80vh]">
        <div className="h-full flex flex-col justify-evenly items-center">
        <RiComputerLine className="md:h-20 md:w-20  md:border-2 border-primary rounded-full md:p-[1vw] text-primary mt-4 text-8xl my-8" />
        <div className="font-bold md:text-3xl text-2xl text-center">
          <h1>AI Mock Interviewer</h1>
        </div>
        <div className="text-center font-semibold text-lg text-gray-500 px-12">
          <p>
            You&apos;ll be taking a 20-minute interview to have your skills
            evaluated. Just relax and take the interview.{" "}
          </p>
        </div>
        <div className="flex flex-row justify-evenly relative top-[3vh] gap-2 w-full md:px-[1vw] pb-8 md:mt-16 md:gap-6 px-[2vw]">
          <Link
            href="#"
            className="bg-white py-2 md:py-5 px-3 w-1/2 font-semibold text-primary md:text-xl rounded-lg border-2 border-primary text-center max-h-[60px] items-center flex justify-center hover:bg-primary hover:text-white transition"
          >
            Past Analysis
          </Link>
          <button onClick={HandleInterviewClick} 
            className="bg-primary py-2 md:py-5 px-3 w-1/2 font-semibold text-white md:text-xl rounded-lg border-2 border-primary text-center max-h-[60px] items-center flex justify-center hover:bg-purple-600 transition"
          >
            Get Interviewed
          </button>
        </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg row-span-4 col-span-2 h-full shadow-lg flex justify-center items-center">
        <div className="flex flex-row md:text-3xl text-xl text-primary gap-4 justify-center">
          <FaLinkedin />
          <h1 className="font-bold">LinkedIn review coming soon!</h1>
        </div>
      </div>
    </div>
  );
}
