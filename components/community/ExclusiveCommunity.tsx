"use client";
import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

interface Community {
  id: string;
  createdAt: string;
  lastmessageAt: string;
  name: string;
  description: string;
  isCommunity: boolean;
  messagesIds: any;
  userIds: string[];
  comm_type: "exclusive" | "normal";
}
interface ExclusiveCommunityProps {
  exclusiveCommunities: Community[];
}

const ExclusiveCommunity: React.FC<ExclusiveCommunityProps> = ({
  exclusiveCommunities,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  // const [exclusiveCommunities, setExclusiveCommunities] = useState<Community[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };
  
  const CardComponent = ({ data }: { data: Community }) => {
    const { name, description } = data;

    return (
      <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-slate-300 shadow-md">
        <div className="rounded-lg h-[60%] relative">
          <Image
            alt={name}
            width={100}
            height={100}
            src={"/home/profile.jpg"}
            className="rounded-lg w-full"
          />
        </div>
        <p className="font-bold text-xl h-auto w-[50%] mt-3 ml-5 flex items-center text-ellipsis">
          {name}
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3 -ml-0 relative">
        <div className="flex flex-row justify-between">
          <span className="text-base font-semibold">Exclusive Communities</span>
          <div className="flex flex-row gap-4">
            <button onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
            <button onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="carousel-container absolute top-7 ml-2 flex justify-start">
          <div
            className="carousel flex overflow-x-auto scrollbar-hide w-[90vw] md:w-[34vw] h-[250px]"
            ref={carouselRef}
          >
            {exclusiveCommunities.length ? (
              exclusiveCommunities.map(
                (community: Community, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-1/2 md:w-1/2 h-full p-2 snap-start"
                  >
                    <CardComponent data={community} />
                  </div>
                )
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                No exclusive communities available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExclusiveCommunity;
