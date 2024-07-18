"use client"
import Image from "next/image";
import React, { useState,useEffect } from 'react';
import Exdata from '@/app/data/Excommunity.json';
import Alldata from '@/app/data/Allcommunity.json'
import Carousel from '@/app/components/community/NewCarousel'
export default function Community() {
    const ExdataLen = Exdata.length;
    const AlldataLen = Alldata.length;
    const [messageHeading, setMessageHeading] = useState('');
    const [icon, setIcon] = useState('');
    const toggleHeading = (text: string) => {
        setMessageHeading(text);
    }
    const toggleIcon = (text:any) => {
        setIcon(text);
    }
    const [smScreen, setSmScreen] = useState(false);
    const handleSmScreen = () => {
        setSmScreen(!smScreen)
    }
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const checkScreenSize = () => {

        setIsSmallScreen(window.innerWidth < 640); // Tailwind's sm breakpoint is 640px
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="w-full flex justify-center">
            <div className="bg-[#F1EAFF] w-full h-[90vh] lg:h-[88vh] xl:h-[90vh] flex flex-wrap md:flex-nowrap gap-3" >
                <div className=" w-full md:w-2/5 h-full flex flex-col gap-3 pl-4 pt-3 overflow-auto scrollbar-hide overflow-x-hidden">
                    <div className=" text-[#737373] font-semibold flex flex-col gap-2.5">
                        <div className="font-bold">Hello Raj!</div>
                        <span className="text-[#A6A6A6]">Lear with your peers to maximise learing</span>
                        <div className="relative">
                            <input type="text" className="pl-10 pr-4 py-2 w-11/12 border rounded-lg" placeholder="Search Problems" />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Image src="/community/search-lens.svg" alt="search" width={25} height={25} />
                            </div>
                        </div>
                    </div>
                    <Carousel />
                    <div className="flex flex-col gap-3 overflow-x-clip mt-[250px] mr-2">
                        <div className="flex flex-row justify-between">
                            <span className="text-base font-semibold">All Communities</span>
                            <button className="text-sm font-semibold text-[#8c52ff]">See All</button>
                        </div>
                        <div className="w-full gap-3 flex flex-col justify-center">
                            {
                                Alldata.map((item, index) => (
                                    <div key={index} className="w-full h-20 bg-[#fff] flex flex-row text-md font-bold justify-between items-center rounded-lg hover:bg-[#b290f5] cursor-pointer" onClick={() => { toggleHeading(Alldata[index].name); toggleIcon(Alldata[index].svg);handleSmScreen()}}>
                                        <div className="flex flex-row items-center">
                                            <div className="w-[80px] p-1"><Image src={Alldata[index].svg} alt="img" height={10} width={10}  className="w-full" /></div>
                                            <span className="pl-5">{Alldata[index].name}</span>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full bg-[#8c52ff] text-lg ${Alldata[index].message === 0 ? "hidden" : "flex"} flex justify-center items-center text-[#fff] mr-3`}>{Alldata[index].message}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={`${isSmallScreen ? "absolute top-14 h-[90%] w-full ml-0" : ""} ${smScreen?"flex":"hidden"} md:flex flex-col md:h-full w-3/5 bg-[#fff] rounded-lg m-3 mb-0`}>
                    <div className="flex flex-row bg-[#8c52ff] w-full h-16 rounded-lg items-center justify-between">
                        <div className={` rounded-full flex justify-center items-center md:hidden`} onClick={handleSmScreen}><Image src="/community/backarrow-white.png" alt="img" height={10} width={10} className="w-8 h-8" /></div>
                        <div className="flex flex-row gap-14 items-center pl-10">
                            <div className="w-12 h-12 bg-[#fff] rounded-full flex justify-center items-center"><Image src={icon} alt="img" height={10} width={10} className="w-8 h-8" /></div>
                            <span className="text-xl font-semibold text-[#fff]">{messageHeading}</span>
                        </div>
                        <div className="flex flex-row items-center gap-8 pr-6">
                            <div><Image src="/community/searchdocument.svg" alt="img" height={10} width={10} className="w-8 h-8" /></div>
                            <div><Image src="/community/arrowdown.svg" alt="img" height={10} width={10} className="w-6 h-6" /></div>
                        </div>
                    </div>
                    <div className="flex flex-grow"></div>
                    <div className="flex justify-center p-3">
                        <div className={`relative w-full  md:w-[65vw] `}>
                            <input type="text" className="pl-10 pr-4 py-2 w-full border rounded-lg bg-[#D9D9D9]" placeholder="text" />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none justify-between w-full">
                                <Image src="/community/textplussign.svg" alt="search" width={25} height={25} />
                                <Image src="/community/sendicon.svg" alt="send" width={25} height={25} className="mr-3" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}