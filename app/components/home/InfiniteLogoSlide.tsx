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
import Marquee from "@/app/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {/* <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        /> */}
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function InfiniteLogoSlide() {
  return (
    <>
      <div className="relative flex h-[200px] w-full max-w-[calc(100vw-16px)] flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
        <Marquee className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary-foreground to-transparent dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary-foreground to-transparent dark:from-background"></div>
      </div>
    </>
  );
}

export default InfiniteLogoSlide;
