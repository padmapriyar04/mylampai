"use client";
import React, { useRef, useState } from "react";
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
  comm_type: "Exclusive" | "Normal";
}

interface ExclusiveCommunityProps {
  exclusiveCommunities: Community[];
}

const ExclusiveCommunity: React.FC<ExclusiveCommunityProps> = ({
  exclusiveCommunities,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  const CardComponent = ({ data }: { data: Community }) => {
    const { name, description } = data;

    return (
      <div className="w-[90%] h-[100%] bg-white rounded-2xl shadow-md p-4">
        <div className="rounded-lg h-[60%] relative">
          <Image
            alt={name}
            width={100}
            height={100}
            src={"/home/profile.jpg"} // Ensure this path is correct
            className="rounded-lg w-full"
          />
        </div>
        <p className="font-bold text-xl mt-3 flex items-center">
          {name}
        </p>
        <p className="text-gray-600 mt-2">{description}</p>
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
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}
      </style>
      <div className="flex flex-col gap-3 ml-0 relative">
        <div className="flex flex-row justify-between items-center">
          <span className="text-base font-semibold">Exclusive Communities</span>
          <div className="flex flex-row gap-4">
            <button onClick={scrollLeft} aria-label="Scroll Left">
              <FaChevronLeft />
            </button>
            <button onClick={scrollRight} aria-label="Scroll Right">
              <FaChevronRight />
            </button>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="carousel-container flex overflow-x-auto scrollbar-hide">
          {exclusiveCommunities.length ? (
            exclusiveCommunities.map((community) => (
              <div
                key={community.id} // Use unique identifier from Community
                className="flex-shrink-0 w-1/2 md:w-1/2 h-full p-2 snap-start"
              >
                <CardComponent data={community} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-full text-gray-500">
              No exclusive communities available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExclusiveCommunity;
