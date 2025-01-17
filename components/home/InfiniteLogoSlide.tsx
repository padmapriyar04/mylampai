import Image from "next/image";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const collegesLogo = [
  {
    img: "/home/herosection/image2.svg",
  },
  {
    img: "/home/herosection/image3.svg",
  },
  {
    img: "/home/herosection/image4.svg",
  },
  {
    img: "/home/herosection/image5.svg",
  },
  {
    img: "/home/herosection/image6.svg",
  },
  {
    img: "/home/herosection/image7.svg",
  },
];

const firstRow = collegesLogo.slice(0, collegesLogo.length);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        "relative w-52 cursor-pointer border bg-white overflow-hidden rounded-xl p-4"
      )}
    >
      <Image
        className="rounded-full h-[80px] grayscale-100 w-auto m-auto"
        width="100"
        height="100"
        alt=""
        src={img}
      />
    </figure>
  );
};

export function InfiniteLogoSlide() {
  return (
    <>
      <div className="relative flex h-[200px] w-full max-w-[calc(100vw)] flex-col items-center z-10 justify-center overflow-hidden rounded-lg">
        <Marquee className="[--duration:20s]">
          {firstRow.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 dark:from-background"></div>
      </div>
    </>
  );
}

export default InfiniteLogoSlide;
