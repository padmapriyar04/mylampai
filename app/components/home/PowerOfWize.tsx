import Image from "next/image";
import ImageGrid from "./ImageGrid";

export default function PowerOfWize() {
  return (
    <>
      <div className="flex flex-col  md:flex-row md:justify-between w-full max-w-[1300px] m-auto gap-4 ">
        <div className="w-full flex flex-col pl-8 md:items-start justify-evenly md:pl-4">
          <p className="w-full text-sm font-bold mb-4">
            ----- The Power of wiZe
          </p>
          <div className="flex flex-col items-start max-w-[500px] gap-8 pr-8 mb-4">
            <p className="text-3xl md:text-4xl font-medium">
              Your Gateway To Limitless Creativity -{" "}
              <span className="text-[#5FE8F1]">One</span> platform,{" "}
              <span className="text-[#8C52FF]">Millions</span> of possibilities
            </p>
            <button className="flex items-center gap-2 text-lg md:text-xl border-2 border-black rounded-full px-4 py-2 font-semibold hover:scale-105 transition-all ease-in-out">
              Learn More{" "}
              <Image
                src={"/home/ArrowLearnMore.svg"}
                alt=""
                height={30}
                width={30}
              />
            </button>
          </div>
          <p className="w-full text-sm font-bold mb-4">
            Trusted by leading professionals and visionary partners ----
          </p>
        </div>
        <div className="grid gap-4 grid-cols-2 relative w-full max-w-[600px] m-auto p-4">
          <Image
            width={100}
            height={100}
            src="/home/PowerOfWize.svg"
            alt="Background Image"
            className="w-[298px] rounded-tr-[5rem] rounded-bl-[5rem] h-full"
          />
          <Image
            width={100}
            height={100}
            src="/home/PowerOfWize.svg"
            alt="Background Image"
            className="w-[298px] rounded-br-[5rem] rounded-tl-[5rem]  h-full"
          />
          <Image
            width={100}
            height={100}
            src="/home/PowerOfWize.svg"
            alt="Background Image"
            className="w-[298px] rounded-tl-[5rem] rounded-br-[5rem]  h-full"
          />
          <Image
            width={100}
            height={100}
            src="/home/PowerOfWize.svg"
            alt="Background Image"
            className="w-[298px] rounded-bl-[5rem] rounded-tr-[5rem]  h-full"
          />
        </div>
        {/* <ImageGrid /> */}
      </div>
      <div className="flex items-center flex-col sm:flex-row justify-between rounded-2xl shadow-md my-[100px] bg-primary-foreground m-2 md:m-auto sm:m-4 sm:py-8 p-4 sm:px-12 min-h-[100px] max-w-[1300px]">
        <p className="sm:text-lg font-semibold mb-2 text-center text-[#1c1c1c]">
          So, what are you waiting for? <br className="hidden sm:block" />
          Start exploring career options now!
        </p>
        <button className="bg-primary transition-all border-2 border-primary text-white hover:bg-white hover:text-primary font-semibold sm:text-lg rounded-lg py-2 px-4 sm:px-8 shadow-md ">
          Let&apos;s get Started
        </button>
      </div>
    </>
  );
}
