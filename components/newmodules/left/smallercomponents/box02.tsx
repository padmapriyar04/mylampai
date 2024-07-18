// LeftSide.tsx
import React from 'react';
import Image from 'next/image';
const Box02: React.FC = () => {
    return (
        <div className=" relative h-[100px] w-full my-2 max-w-[350px] bg-white mx-auto  rounded-lg flex justify-between  items-center ">
             <div className=" mx-2 rounded-full bg-white  h-16 w-16 flex items-center justify-center">
              <Image
              src="/modules/robot (1).svg"
              alt="Verceldcjncn Logo"
              className=""
              width={90}
              height={90}
            />
            </div>
            <div className=' w-fit h-fit flex flex-col items-center'>
            <h1 className="  font-semibold text-lg ">Grade 47%</h1>
            <h2 className="  font-semibold text-lg">Credits 4/12</h2>
            </div>
            <div className=" mr-2 rounded-full bg-white  h-16 w-16 flex items-center justify-center ">
              <Image
              src="/modules/calendar.svg"
              alt="Verceldcjncn Logo"
              className=""
              width={60}
              height={60}
            />
            </div>
        </div>
    );
};

export default Box02;
