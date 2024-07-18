"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import bytedata from '@/app/data/bytesCarousel.json'
export default function VideoPage() {
    const [page, setPage] = useState(1);
    const setDiv = Array(4).fill(null);
    const renderSlideDiv = Array(4).fill(null);
    const renderQnDiv = Array(2).fill(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = bytedata.length;

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
        if (page > 1) {
            setPage(page - 1);
        }
    };
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
        if (page < 24) {
            setPage(page + 1)
        }
    };
    
    return (
            <div className="h-[90vh] overflow-y-clip w-full bg-[#E8E2F4] flex flex-col relative">
                <div className="h-16 w-full hidden lg:flex justify-center items-center gap-9 ">
                    {
                        setDiv.map((items, index) => (
                            <div className="flex gap-9" key={index}>
                                <div className="flex flex-row gap-3">
                                    {
                                        renderSlideDiv.map((slideitem, slideindex) => (
                                            <div key={slideindex} className={`w-6 h-1 rounded-md ${index * 6 + slideindex + 1 <= page ? 'bg-[#000]' : 'bg-[#fff]'}`}></div>
                                        ))
                                    }
                                </div>
                                <div className="flex flex-row gap-3">
                                    {
                                        renderQnDiv.map((qnitems, qnindex) => (
                                            <div key={qnindex} className="w-6 h-1 bg-[#8C52FF] rounded-md"></div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex flex-grow justify-between items-center ">
                    <div className="flex items-center pl-10"><Image src="/lfarw.svg" alt="arrow" height={20} width={20} onClick={prevSlide} /></div>
                    <div className="overflow-hidden w-1/2">
                        <div
                            className="flex transition-transform duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {bytedata.map((item, index) => (
                                <div key={index} className="min-w-full flex-shrink-0">
                                    <Image src={item.svg} className="w-full h-60 object-cover" alt="img" height={100} width={100}/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center pr-10"><Image src="/rfarw.svg" alt="invarrow" height={20} width={20} onClick={nextSlide} /></div>
                </div>
                <div className="h-52 flex justify-between items-center ml-8">
                    <div className="flex flex-row gap-6">
                        <div><Image src="/play.svg" alt="play" height={70} width={70} /></div>
                        <div className="flex flex-col justify-center">
                            <span className="text-md md:text-xl font-medium">Data Analytics</span>
                            <span className="text-md md:text-md font-medium text-[#737373]">BYTE {page}/24</span>
                        </div>
                    </div>
                    <div className="w-20 h-20 bg-[#ffffff] rounded-full mr-8 flex justify-center items-center"><Image src="/robot icon.svg" alt="bot" height={40} width={40} /></div>
                </div>

            </div>
        
    );
}