"use client";
import SliderCard from "./SliderCard";
import sliderData from "@/data/home/SliderData.json";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import AutoPlay from "embla-carousel-autoplay";

const HomeSlider: React.FC = () => {
  return (
    <>
      <div className=" py-[60px] flex items-center justify-center ">
        <Carousel
          plugins={[AutoPlay({ delay: 2000, stopOnFocusIn: true, stopOnMouseEnter: true, stopOnInteraction: false })]}
          className="w-full max-w-[500px] md:max-w-[1220px]"
        >
          <CarouselContent>
            {sliderData.map((_, index) => {
              return (
                <SliderCard key={index} index={index}/>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="relative translate-y-1/2 left-0 mx-4 bg-[#e7e7e7d0] " />
          <CarouselNext className="relative translate-y-1/2 right-0 mx-4 bg-[#e7e7e7d0] " />
        </Carousel>
      </div>
    </>
  );
};

export default HomeSlider;
