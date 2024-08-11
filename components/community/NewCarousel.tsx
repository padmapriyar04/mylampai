"use client";
import React, { useRef } from 'react';
import Image from "next/image";
import Exdata from '@/app/data/Excommunity.json';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ExdataType {
	name: string;
	svg: string;
	message: number;
}

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const CardComponent = ({ data }: { data: ExdataType }) => {
    const { name, svg, message } = data;

    return (
      <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-slate-300 shadow-md">
        <div className="rounded-lg h-[60%] relative">
          <Image
            alt={name}
            layout="fill"
            objectFit="cover"
            src={svg}
            className="rounded-lg"
          />
        </div>
        <p className="font-bold text-xl h-auto w-[50%] mt-3 ml-5 flex items-center text-ellipsis">{name}</p>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      <div className="flex flex-col gap-3 -ml-0 relative">
        <div className="flex flex-row justify-between">
          <span className="text-base font-semibold">Exclusive Assessments</span>
          <div className="flex flex-row gap-4">
            <button onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
            <button onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="carousel-container absolute top-7 ml-6 flex justify-start">
          <div
            className="carousel flex overflow-x-auto scrollbar-hide w-[90vw] md:w-[34vw] h-[250px]"
            ref={carouselRef}
          >
            {Exdata.map((data, index) => (
              <div key={index} className="flex-shrink-0 w-1/2 md:w-1/2 h-full p-2 snap-start">
                <CardComponent data={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
