"use client"
import Image from "next/image";
import { useState } from "react";
import LearnModuleCard from "@/components/learn/LearnModuleCard";
import IntroCard from "@/components/learn/introcard";
import Link from 'next/link';

export default function Learn() {
  const [progress, setProgress] = useState(90);
  const [cardOpen, setCardOpen] = useState(-1);

  return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full max-w-[1300px] m-auto relative rounded-lg">

          <div className="w-full justify-between rounded-lg  p-6">
            <div className="flex  md:h-96   h-fit   rounded-lg md:w-full w-full sm:w-[80%]  mx-auto md:mx-0 sm:mb-5 flex-row justify-center md:justify-between">
              <div className="w-full  lg:w-8/12 mr-0 mt-0  sm:mb-0 bg-white  rounded-lg ... ">

                <IntroCard />

                <div className="md:h-full w-full  md:justify-between p-4 md:flex hidden ">
                  <div className="md:h-full lg:w-[30%] h-52 md:w-[42%] w-full rounded-lg flex justify-center md:flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" title="Woman holding a mug">
                    <Image
                      src="/robot002.svg"
                      alt="Verceldcjncn Logo"
                      className="md:object-cover md:w-[400px] md:h-full h-40 rounded-lg "
                      width={200}
                      height={96}
                    />
                  </div>

                  <div className=" md:w-full max-w-[900px] h-96 md:mx-0 mx-[180px]  hidden   md:h-full w-1/2   md:left-0  rounded-b lg:rounded-b-none  lg:rounded-r p-4 md:flex flex-col md:justify-between  leading-normal">
                    <div className="mb-8 relative h-fit ">
                      <div className="text-gray-900 font-semibold xl:text-2xl relative w-full  sm:text-[21px] md:text-[22px] lg:text-2xl flex ">
                        Introduction to Machine Learning
                      </div>
                      <div className="flex absolute sm:top-8 w-full md:mt-3  items-center text-[#0166C8] justify-start flex-row lg:gap-4 font-semibold ">
                        <div className="w-full md:w-32 max-w-36  bg-[#E8E2F4] px-7 py-2 text-center rounded-md md:mr-4 text-md ">3 weeks</div>
                        <div className="w-full md:w-32 max-w-36  bg-[#E8E2F4] py-2 px-5 rounded-md text-center text-md ">6 months</div>
                      </div>

                      <div className="flex absolute sm:top-32 w-full items-center justify-start flex-row text-[#737373] font-semibold gap-4">
                        <div className="w-fit">
                          <Image
                            src="/learn/module.svg"
                            alt="Search Icon"
                            width={20}
                            height={20}
                            priority
                            className="w-6 h-6 md:w-6  md:h-6 "
                          />
                        </div>
                        <div className="w-fit  text-center rounded-sm text-sm lg:text-[18px] md:text-[16px]">Module:</div>
                        <div className="w-fit  text-center text-sm lg:text-[18px] md:text-[16px]">Data science</div>
                      </div>
                      <div className="flex absolute sm:top-44   w-full items-center justify-start flex-row gap-[14px] text-[#737373] font-semibold  ">
                        <div className="w-fit">
                          <Image
                            src="/learn/chapter.svg"
                            alt="Search Icon"
                            width={20}
                            height={20}
                            priority
                            className="w-6 h-6 md:w-6 md:h-6"
                          />
                        </div>
                        <div className="w-fit  text-center rounded-sm text-sm lg:text-[18px] md:text-[16px]">Chapter:</div>
                        <div className="w-fit text-left text-sm lg:text-[18px] md:text-[16px] ">Supervise learning and applications</div>
                      </div>

                      <div className="absolute top-[230px] w-full mx-5 max-w-[350px] flex items-center gap-2">
                        <div className="w-fit text-center align-middle mr-auto font-semibold text-[#737373]">{progress}%</div>
                        <div className="w-full max-w-[350px] h-[9px] border-[1px] border-[#8C52FF] rounded-lg overflow-hidden">
                          <div className="bg-[#8C52FF] h-full text-white text-center leading-8" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex absolute sm:top-72  w-full md:h-fit text-[15px] font-semibold gap-10 text-center text-[#8C52FF]">
                        <Link href={"/learn"} className="w-fit px-6 py-2 h-fit hover:bg-[#8C52FF] hover:text-white  border-2 transition-all ease-in-out border-[#8C52FF] rounded-md ">View Insights</Link>
                        <Link href={"/learn/modules"} className="w-fit p-2 px-6 h-fit border-2 border-[#8C52FF] hover:bg-[#8C52FF]  transition-all ease-in-out hover:text-white rounded-md">Resume Learning</Link>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
              <div className=" ml-6 full sm:w-1/3 hidden lg:block   md:w-4/12 lg:h-96 md:h-full bg-white  rounded-lg"></div>
            </div>


            <LearnModuleCard />
            <LearnModuleCard />
            <LearnModuleCard />
            <LearnModuleCard />

          </div>
        </div>

  );
};