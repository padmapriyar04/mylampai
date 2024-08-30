"use client";
import { BiSearchAlt } from "react-icons/bi";
import AllAssessments from "../../../components/practice/AllAssessments";
import ExclusiveAssessements from "../../../components/practice/ExclusiveAssessements";
import ProgressSection from "../../../components/practice/ProgressSection";
import StreakSection from "../../../components/practice/StreakSection";

import exclusiveAssements from "@/data/practise/exclusiveAssessments";
import allAssessements from "@/data/practise/allAssessments";

const Practice = () => {
  return (
    <div className="bg-[#F1EAFF] p-5 min-h-screen flex flex-col lg:flex-row justify-between z-0 max-w-[calc(100vw-240px)]">
      <div className="w-full lg:w-[60%] mb-5 lg:mb-0 ">
        <div className="mb-5">
          <p className="text-[#737373] font-bold text-xl">Let&apos; Rock!</p>
          <p className="text-[#A6A6A6] text-sm">
            Practice regularly to achieve perfection
          </p>
        </div>
        <div className="flex items-center gap-5 mt-5 bg-white rounded-lg px-5 py-2 shadow-md shadow-slate-200">
          <label htmlFor="search-problems">
            <BiSearchAlt className="text-[#8C52FF] text-4xl" />
          </label>
          <input
            type="text"
            name="search-problems"
            id="search-problems"
            placeholder="Search Problems"
            className="w-full outline-none"
          />
        </div>
        <div className="mt-5">
          <ExclusiveAssessements exclusiveAssements={exclusiveAssements}/>
        </div>
        <div className="mt-5">
          <AllAssessments allAssessements={allAssessements} />
        </div>
      </div>
      <div className="w-full lg:w-[37%]">
        <div className="lg:sticky lg:top-[5.5rem] ">
          <div className="mb-5">
            <ProgressSection />
          </div>
          <div>
            <StreakSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
