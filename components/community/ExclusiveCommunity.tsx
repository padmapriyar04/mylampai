"use client";
import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";

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

const CardComponent = ({ data }: { data: Community }) => {
  const { name } = data;

  return (
    <CarouselItem className="basis-1/2">
      <div className="bg-white rounded-2xl h-full overflow-hidden">
        <div className="h-[180px] relative">
          <Image
            alt={name}  
            width={1000}
            height={1000}
            src={"/home/profile.jpg"}
            className="rounded-lg h-full w-auto object-cover"
          />
        </div>  
        <p className="font-semibold text-lg text-[#111] h-auto py-2 px-4 flex items-center">
          {name}
        </p>
      </div>
    </CarouselItem>
  );
};

const ExclusiveCommunity: React.FC<ExclusiveCommunityProps> = ({
  exclusiveCommunities,
}) => {


  return (
    <>
      <div className="flex flex-col gap-4 relative">
        <div className="flex flex-row justify-between">
          <span className="text-xl font-semibold">Exclusive Communities</span>
          <div className="flex flex-row gap-4">
            <button >
              <FaChevronLeft />
            </button>
            <button >
              <FaChevronRight />
            </button>
          </div>
        </div>
        {exclusiveCommunities.length ? (
          <Carousel>
            <CarouselContent className="min-h-[250px]">
              {exclusiveCommunities.map(
                (community: Community, index: number) => (
                  <CardComponent data={community} key={index} />
                ),
              )}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="flex justify-center items-center w-full h-full text-gray-500">
            No exclusive communities available
          </div>
        )}
      </div>
    </>
  );
};

export default ExclusiveCommunity;
