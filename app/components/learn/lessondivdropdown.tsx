"use client";

import React from "react";
import Image from "next/image";

interface Lesson {
  id: number;
  name: string;
  language: string;
  image1: string;
  image2: string;
}

const lessonsData: Lesson[] = [
  { id: 1, name: "Language of ML", language: "python", image1: "/learn/play button.svg", image2: "/learn/revise.svg" },
  { id: 2, name: "Supervised Learning: Classification", language: "javascript", image1: "/learn/icon 1.svg", image2: "/learn/completed.svg" },
  { id: 3, name: "Assessment: Python", language: "java", image1: "/learn/icon2.svg", image2: "/learn/not started.svg" },
  { id: 4, name: "Hands on: ML", language: "ruby", image1: "/learn/icon 3.svg", image2: "/learn/try again.svg" },
  { id: 5, name: "ML: Interact with data", language: "typescript", image1: "/learn/icon 4 copy.svg", image2: "/learn/not started.svg" }
];


const Lessonsdiv01: React.FC = () => (
  <div className="mx-2 sm:mx-6 w-full max-w-full flex justify-center sm:pr-3 sm:ml-2 ">
    <div className="border-[0.5px] border-[#737373] rounded-xl flex flex-col w-fit h-fit py-4 px-4 sm:px-8 bg-[#E8E2F4]">
      <div className="text-black text-lg sm:text-xl font-semibold mb-4">Lessons</div>
      <div className="grid grid-cols-1 gap-3">
        {lessonsData.map((lesson) => (
          <div key={lesson.id} className="w-full h-14 flex items-center border border-gray-50 rounded-xl overflow-hidden hover:bg-gray-50">
            <div className="w-16 h-16 flex justify-center items-center mr-4">
              <Image
                src={lesson.image1}
                alt="Lesson Icon"
                className="border-rad"
                width={30}
                height={30}
                priority
              />
            </div>
            <div className="flex-1 w-full">
              <h4 className="text-black text-sm font-semibold">{lesson.name}</h4>
              <p className="text-gray-500 text-xs">{lesson.language}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Lessonsdiv01;