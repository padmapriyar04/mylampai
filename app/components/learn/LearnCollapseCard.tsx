import React, { useState } from "react";
import Image from "next/image";
import LearnCollapseItem from "./LearnCollapseItem";
import Lessonsdiv from "./Lessonsdiv";
import useBooleanStore from "./store";
import Lessonsdiv01 from "./lessondivdropdown";

export default function LearnCollapseCard() {
  const booleanValue = useBooleanStore((state) => state.booleanValue);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="p-4 text-white flex flex-col">
        <div className="w-full h-full flex flex-row gap-2 justify-between md:mx-6">
          <div className="h-full lg:w-[35%] md:w-[40%] w-full mx-auto md:mx-0 cursor-pointer">
            <LearnCollapseItem activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={1} />
            <LearnCollapseItem activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={2} />
            <LearnCollapseItem activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={3} />
            <LearnCollapseItem activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={4} />
            <LearnCollapseItem activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={5} />
          </div>
          {activeIndex !== 0 && <Lessonsdiv />}
        </div>
        <div className="w-full h-fit pr-3 pl-6 lg:block hidden">
          <div className="w-full h-36 rounded-lg bg-[#E8E2F4] mb-5 max-w-[1300px] flex flex-row">
            <div className="bg-[#8C52FF] w-40 max-w-44 h-full rounded-lg flex justify-center items-center">
              <Image
                src="/project.svg"
                alt="Verceldcjncn Logo"
                width={90}
                height={90}
                priority={true}
                className="h-fit w-fit"
              />
            </div>
            <div className="bg-[#E8E2F4] w-full justify-around flex-col rounded-lg">
              <div className="w-full h-[46%] flex justify-between border-b-[0.5px] border-[#737373]">
                <div className="w-fit h-fit mt-3 ml-4">
                  <span className="text-centre text-black font-semibold text-[24px]">Capstone Project</span>
                </div>
                <div className="w-fit h-fit mt-5 mr-7">
                  <span className="text-centre text-[#8C52FF] font-semibold text-[15px]">View Guidelines</span>
                </div>
              </div>
              <div className="sm:w-full sm:h-[55%] flex justify-between sm:ml-4">
                <div className="w-full max-w-[900px] h-fit rounded-lg">
                  <p className="text-centre text-[#737373] italic text-[17px] underline">Avengers and Silicon Valley</p>
                  <p className="text-centre text-[#737373] text-[14px] mt-2 leading-4">
                    Avengers: Harness Python to conquer challenges in this Silicon Valley-inspired project. Learn Python and machine learning as you emerge as a tech hero!
                  </p>
                </div>
                <div className="w-fit h-full mx-9">
                  <Image src="/learn/arrow.svg" alt="Verceldcjncn Logo" className="w-full h-fit my-6" width={15} height={15} priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
