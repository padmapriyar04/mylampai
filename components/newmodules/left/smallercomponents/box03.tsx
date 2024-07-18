// LeftSide.tsx
"use client"
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import LessonsModule from './dropdownlessons/lessonsdropdown';
import dropdownLesson from './zustanddropdown02';
import { FaArrowAltCircleRight } from "react-icons/fa";
interface Box03Props {
    onClick?: () => void;
}


const Box03: React.FC<Box03Props> = ({ onClick }) => {

    const [progress, setProgress] = useState(90);
    const { isOpen, toggleOpen } = dropdownLesson();

    const handleToggle = () => {
        toggleOpen();
    };

    return (
       
        <div onClick={onClick} className={` ${isOpen ? 'bg-white' : 'bg-[#8C52FF]'} mt-2 h-[105px] relative w-full  max-w-[350px]   mx-auto  rounded-lg cursor-pointer `}>
            <div onClick={handleToggle} className={` h-[80px] w-full ${isOpen ? 'border-[0.5px] border-[#828282]' : ''}  max-w-[350px] bg-white mx-auto flex flex-row justify-between items-center  rounded-lg `}>
                <div className="  mx-4  rounded-full bg-white  h-14 w-14  flex items-center justify-center">
                    <Image src="/modules/ml.svg" alt="Verceldcjncn Logo" className="" width={70} height={70} />
                </div>
                <div className='w-full my-2'>
                    <h1 className="text-left text-sm font-[500] ">chapter 1</h1>
                    <h2 className=" text-left  text-md font-semibold -mt-1">Getting Started with ML</h2>
                    <div className='  w-full h-full flex flex-row'>
                        <div className=" w-full max-w-[265px] my-2   h-[7px] border-[1px] border-[#8C52FF] rounded-lg overflow-hidden ">
                            <div className="bg-[#8C52FF] h-full text-white text-center leading-8" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className={` ${isOpen?'':'hidden'} w-5 h-5 mx-3`}> <Image  src="/modules/module arrow.svg" alt="Verceldcjncn Logo" className=""width={30} height={30}/></div>
                    </div>
                </div>

            </div>
            <div className=" absolute right-3 bottom-[5.5px] rounded-full h-4 w-4 "><FaArrowAltCircleRight size={17} color="white" /></div>
            {
                isOpen && <LessonsModule />
            }
        </div>
    );
};

export default Box03;
