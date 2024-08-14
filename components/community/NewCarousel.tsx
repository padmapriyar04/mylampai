"use client";
import React, { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Community {
  id: string;
  createdAt: string;
  lastmessageAt: string;
  name: string;
  description: string;
  isCommunity: boolean;
  messagesIds: any[];
  userIds: string[];
  comm_type: "Exclusive" | "Normal"; // Adjusted property name
}

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [exclusiveCommunities, setExclusiveCommunities] = useState<Community[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/community/getAll");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Log the full data to verify the structure
      console.log("Fetched data:", data);

      // Ensure data.communities exists and is an array
      if (Array.isArray(data.communities)) {
        // Log the type of each community to check for discrepancies
        data.communities.forEach((community: Community) => {
          console.log(`Community comm_type: ${community.comm_type}`);
        });

        // Filter for exclusive communities
        const exclusive = data.communities.filter((community: Community) => community.comm_type === "Exclusive");
        console.log("Exclusive communities:", exclusive); // Debug statement
        setExclusiveCommunities(exclusive);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      setError("Failed to load communities.");
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const CardComponent = ({ data }: { data: Community }) => {
    const { name, description } = data;

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
      <div className="flex flex-col gap-3 ml-0 relative">
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
            {exclusiveCommunities.length > 0 ? (
              exclusiveCommunities.map((data, index) => (
                <div key={index} className="flex-shrink-0 w-1/2 md:w-1/2 h-full p-2 snap-start">
                  <CardComponent data={data} />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500">
                No exclusive communities available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
