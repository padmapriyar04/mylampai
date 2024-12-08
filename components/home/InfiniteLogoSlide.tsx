import Image from "next/image";
import "./HeroSection.css";

// const InfiniteLogoSlide: React.FC = () => {
//   return (
//     <>
//       <div className="home-infinite-logos overflow-hidden pt-2 pb-6 max-w-screen whitespace-nowrap relative">
//         <div className="infinite-logo-slide inline-block ">
//           <Image
//             src={"/home/herosection/image2.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image3.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image4.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image5.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image6.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image7.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//         </div>
//         <div className="infinite-logo-slide inline-block ">
//           <Image
//             src={"/home/herosection/image2.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image3.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image4.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image5.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image6.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//           <Image
//             src={"/home/herosection/image7.svg"}
//             alt=""
//             height={100}
//             width={40}
//             className="inline-block mx-[40px] w-auto h-[100px]"
//           ></Image>
//         </div>
//       </div>

//     </>
//   );
// };

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "/home/herosection/image2.svg",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/home/herosection/image3.svg",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/home/herosection/image4.svg",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/home/herosection/image5.svg",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/home/herosection/image6.svg",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/home/herosection/image7.svg",
  },
];

const firstRow = reviews.slice(0, reviews.length);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl p-4"
      )}
    >
      <Image
        className="rounded-full h-[100px] grayscale-100 w-auto m-auto"
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
      <div className="relative flex h-[180px] w-full max-w-[calc(100vw-18px)] flex-col items-center justify-center overflow-hidden rounded-lg">
        <Marquee className="[--duration:20s]">
          {firstRow.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3  dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3  dark:from-background"></div>
      </div>
    </>
  );
}

export default InfiniteLogoSlide;
