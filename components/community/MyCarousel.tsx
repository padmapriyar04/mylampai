"use client"
import React, { useState, useEffect, useRef } from "react";
import Exdata from '@/app/data/Excommunity.json'
import Image from "next/image";
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const updateItemsToShow = () => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      const newItemsToShow = Math.floor(width / 150); // Assuming each item is approximately 200px wide
      setItemsToShow(newItemsToShow);
    }
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => {
      window.removeEventListener("resize", updateItemsToShow);
    };
  }, []);
  const totalItems = Exdata.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsToShow) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - itemsToShow + totalItems) % totalItems
    );
  };

  const canGoNext = currentIndex + itemsToShow < totalItems;
  const canGoPrev = currentIndex > 0;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <span className="text-base font-semibold">Exclusive Assessments</span>
          <div className="flex flex-row gap-4">
            <button onClick={handlePrev} disabled={!canGoPrev} className={`${!canGoPrev?"opacity-40 cursor-not-allowed":""}`}><Image src="/practice/lfarw.svg" alt="img" width={10} height={10} /></button>
            <button onClick={handleNext} disabled={!canGoNext} className={`${!canGoNext?"opacity-40 cursor-not-allowed":""}`}><Image src="/practice/rfarw.svg" alt="img" width={10} height={10} /></button>
          </div>
        </div>
        <div ref={carouselRef} className="flex overflow-hidden scrollbar-hide gap-3">
          {Exdata.map((slide, index) => (
            <div key={index} className={`h-56 ${index >= currentIndex && index < currentIndex + itemsToShow
              ? "block"
              : "hidden"
            }`}>
              <div className="bg-[#fff] rounded-lg h-full ">
                <div ><Image src={Exdata[index].svg} className="w-full" alt="item" height={100} width={100}/></div>
                <div className="text-md font-bold h-16 flex flex-row justify-around pt-3">
                  <div className="w-3/5">{Exdata[index].name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Carousel;
