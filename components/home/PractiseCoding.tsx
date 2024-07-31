"use client";
import { useState, useEffect } from "react";
import "./PracticeCoding.css";

interface ExpandingCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    bgColor: string;
    moreClass?: string;
}

const ExpandingCard: React.FC<ExpandingCardProps> = ({
    id,
    title,
    description,
    image,
    bgColor,
    moreClass

}) => {
    const [hovered, setHovered] = useState(1);
    const [selectedId, setSelectedId] = useState(id);

    useEffect(() => {
        setHovered(1);
    }, [hovered]);

    return (
        <>
            <input type="radio" name="slide" id={id} className="hidden" defaultChecked={selectedId === id}  />
            <label
                htmlFor={id}
                className={`home-expanding-card w-full border-y-2 sm:border-y-0 sm:w-[200px] cursor-pointer min-h-[350px] flex p-4 gap-4 flex-col items-start justify-between overflow-hidden transition-all bg-white hover:bg-[#f7f7f7]` + " " + moreClass}
                
            >
                <h2 className="text-xl font-semibold">
                    <span className="div text-base">&lt;/&gt;</span> <br /><br />
                    {title}
                </h2>
                <p className="max-w-[180px]">{description}</p>
                <div className="text-xs">400+ Questions</div>
                <button className="bg-blue-700 text-sm text-white rounded-full px-4 py-2">
                    Start Now{" "}
                </button> 
            </label>
        </>
    );
};

const PracticeCoding = () => {
    return (
        <div id="practice" className="pb-[100px] min-h-screen">
            <h4 className="pt-4 font-semibold text-[#8C52FF]">
                PRACTICE
                <div className="bg-[#8C52FF] w-6 h-6 blur-sm rounded-full absolute left-0 translate-x-[-14px] translate-y-[-100%] "></div>
            </h4>
            <div className="text-3xl font-medium mt-8 mb-4">
                Practice Coding & Ace Hiring Assessments
            </div>
            <p className="text-[#000000BB] font-medium my-4">
                Level up your coding skills by practicing the hiring assessments of your
                dream companies & ace your placement game!
            </p>
            <div className="bg-white w-full my-8 ">
                <div className="home-exp-card-container flex justify-start flex-col sm:flex-row-reverse items-center rounded-2xl border-2 border-black overflow-hidden bg-red-50" >
                {/* <div className="flex justify-start flex-col sm:flex-row-reverse items-center rounded-2xl border-2 border-black overflow-hidden bg-red-50" > */}
                    <ExpandingCard
                        id="expandingcard1"
                        title="Coding Practice"
                        bgColor="#F3C1E7"
                        description="Practice coding problems from top companies"
                        image="/home/practiceCoding.svg"
                        moreClass=""
                    />
                    <ExpandingCard
                        id="expandingcard2"
                        title="Ace Assessments"
                        bgColor="#000"
                        description="Practice & ace the hiring assessments of top companies"
                        image="/home/aceAssessments.svg"
                        moreClass=" sm:border-x-2 border-black"
                    />
                    <ExpandingCard
                        id="expandingcard3"
                        title="Interview Prep"
                        bgColor="#C8BBFF"
                        description="Prepare for interviews with mock interviews & feedback"
                        image="/home/interviewPrep.svg"
                        moreClass=""
                    />
                </div>
            </div>
        </div>
    );
};

export default PracticeCoding;
