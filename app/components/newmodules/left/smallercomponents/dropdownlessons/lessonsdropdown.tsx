"use client";

import React, { useState,useEffect } from "react";
import Image from "next/image";
import useStoreright from "@/app/components/newmodules/right/zustandright/storeright";
import Link from "next/link";
import { useRouter } from "next/navigation";


const lessonsData = [
  { id: 1, name: "Language of ML", language: "python", image1: "/learn/play button.svg", image2: "/learn/revise.svg" },
  { id: 2, name: "Supervised Learning", language: "Classification", image1: "/learn/icon 1.svg", image2: "/learn/completed.svg" },
  { id: 3, name: "Assessment: Python", language: "java", image1: "/learn/icon2.svg", image2: "/learn/not started.svg" },
  { id: 4, name: "Hands on: ML", language: "ruby", image1: "/learn/icon 3.svg", image2: "/learn/try again.svg" },
  { id: 5, name: "ML: Interact with data", language: "typescript", image1: "/learn/icon 4 copy.svg", image2: "/learn/not started.svg" }
];

const LessonsModule: React.FC = () => {
  const [lessons, setLessons] = useState(lessonsData);
  const { isOpenright, toggleOpenright } = useStoreright();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 640); // 'sm' breakpoint is 640px in Tailwind CSS
  };
  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleToggle = () => {
    toggleOpenright();
  };
  const handleAssignmentClick = () => {
    if (isSmallScreen) {
      router.push("/learn/modules/test");
    } else {
      handleToggle();
    }
  };

  return (
    <div className="absolute bg-white h-fit w-full rounded-md shadow-sm z-10 p-4">
      {lessons.map((lesson) => (
         <div
         key={lesson.id}
         className="bg-[#E8E2F4] w-full cursor-pointer max-w-[330px] h-[39px] mt-2 flex items-center border-solid border-[1.49px] border-[#8C52FF] rounded-full"
         onClick={lesson.name.includes("Assessment") ? handleAssignmentClick : undefined}
       >
          <div className="w-fit h-fit flex justify-center items-center">
            <Image
              src={lesson.image1}
              alt="Lesson Icon"
              className="mx-2 my-[5px]"
              width={29}
              height={29}
              priority
            />
          </div>
          <div className="flex w-full flex-row mx-1">
            <h4 className="text-black text-sm font-semibold">{lesson.name}</h4>
            <p className="text-gray-500 text-sm my-auto">: {lesson.language}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonsModule;
