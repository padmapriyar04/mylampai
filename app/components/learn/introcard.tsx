import React from "react";
import Image from "next/image";
import { useState } from "react";

export default function IntroCard() {
  const [progress, setProgress] = useState(90);
  return (
    <>
      <div className="bg-white w-full h-fit block md:hidden  p-4 rounded-lg">
        {/* Image at the top */}
        <div className="flex justify-center mb-4">
          <Image
            src="/robot002.svg"
            alt="Intro Image"
            width={200}
            height={60}
            priority
          />
        </div>

        <h1 className="text-[20px] font-bold text-center mt-4">Introduction to Machine Learning</h1>
        <div className="text-center mt-4 text-sm">
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-[#E8E2F4] text-[#0166C8] py-2 px-4 text-xs rounded">3 Weeks</button>
            <button className="bg-[#E8E2F4] text-[#0166C8] py-2 text-xs px-4 rounded">6 Weeks</button>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 text-[#737373] font-semibold gap-4">
          <div className="flex items-center gap-2 w-full max-w-[350px]">
            <Image
              src="/learn/module.svg"
              alt="Module Icon"
              width={20}
              height={20}
              priority
              className="w-5 h-5"
            />
            <div className="text-sm">Module:</div>
            <div className="text-sm md:text-lg">Data science</div>
          </div>
          <div className="flex items-center gap-2 w-full max-w-[350px]">
            <Image
              src="/learn/chapter.svg"
              alt="Chapter Icon"
              width={20}
              height={20}
              priority
              className="w-5 h-5"
            />
            <div className="text-sm md:text-lg">Chapter:</div>
            <div className="text-sm md:text-lg">Supervised learning and applications</div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full max-w-[350px] flex items-center gap-2">
            <div className="w-fit text-center align-middle font-semibold text-sm text-[#737373]">{progress}%</div>
            <div className="w-full max-w-80 h-[7px] border-[1px] border-[#8C52FF] rounded-lg overflow-hidden">
              <div className="bg-[#8C52FF] h-full text-white text-center leading-8" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="w-fit px-2 py-1 h-fit hover:bg-[#8C52FF] text-xs hover:text-white border-2 transition-all ease-in-out border-[#8C52FF] rounded-md">View Insights</button>
          <button className="w-fit py-1 px-2 h-fit border-2 border-[#8C52FF] text-xs hover:bg-[#8C52FF] transition-all ease-in-out hover:text-white rounded-md">Resume Learning</button>
        </div>
      </div>
    </>
  );
}
