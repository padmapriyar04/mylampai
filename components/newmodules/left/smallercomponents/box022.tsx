// LeftSide.tsx
import React from 'react';
import Image from 'next/image';
const Box022: React.FC = () => {
    return (
        <div className=" relative h-[32px] w-full  mt-3 max-w-[350px] gap-4 mx-auto  rounded-lg flex justify-centre  items-center ">
            <div className="h-full w-auto flex items-center">
                <Image
                    src="/modules/insights (1).svg"
                    alt="Vercel Logo"
                    width={25}  
                    height={25}  
                    className=" h-full w-full"
                />
            </div>
            <div className="h-full w-auto flex items-center">
                <Image
                    src="/modules/roadmap (1).svg"
                    alt="Vercel Logo"
                    width={20}  
                    height={20}  
                    className=" h-full w-full"
                />
            </div>
            <div className="h-fit w-auto flex items-center">
                <Image
                    src="/modules/plus (1).svg"
                    alt="Vercel Logo"
                    width={10}  
                    height={10}  
                    className=" h-full w-full"
                />
            </div>
        </div>
    );
};

export default Box022;
