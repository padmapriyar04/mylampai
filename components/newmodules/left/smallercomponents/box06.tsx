// LeftSide.tsx
import React from 'react';
import Image from 'next/image';
import { FaArrowAltCircleRight } from 'react-icons/fa';

const Box02: React.FC = () => {
    return (
      <div className="  mt-3  flex h-[100px] w-full max-w-[350px] bg-white mx-auto  rounded-lg">
      <div className="bg-[#8C52FF] w-1/3 max-w-[36%] rounded-lg flex items-center justify-center p-2 sm:p-4">
        <Image
          src="/project.svg"
          alt="Project Logo"
          width={40}
          height={40}
          className="rounded-lg w-16 sm:w-16 h-fit"
        />
      </div>
      <div className="flex flex-col w-2/3 h-full justify-center items-center">
        <div className="text-base sm:text-lg text-black font-semibold border-[0.5px] border-b-[#828282] w-full h-1/2 flex justify-center items-center">
          Capstone Project
        </div>
        <div className="justify-between italic text-[#A99E9E]  flex-row font-light underline w-full h-1/2 flex items-center">
          <div className='text-sm mx-auto '>Avengers & Silicon Valley</div>
          <div className='items-end mr-2  h-fit w-fit'><Image  src="/modules/module arrow.svg" alt="Verceldcjncn Logo" className=" rotate-180"width={25} height={25}/></div>
        </div>
      </div>
    </div>
    
    );
};

export default Box02;
