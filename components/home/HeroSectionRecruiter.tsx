import Image from "next/image";
import Typing from "./Typing";
import Link from "next/link";
import InfiniteLogoSlide from "./InfiniteLogoSlide";

export default function HeroSectionRecruiter() {
  return (
    <>
      <div className="flex flex-col max-w-screen overflow-hidden bg-primary-foreground">
        <div className="flex justify-evenly items-center min-h-[555px] md:min-h-[700px] pt-4 px-8 gap-8 w-full m-auto">
          <div className="flex flex-col justify-center lg:justify-end min-h-[600px] w-full">
            <div className="text-4xl md:text-5xl xl:text-6xl font-bold lg:ml-14 mb-6">
              <Typing /> <br />
              <span className="font-semibold">Your Dream Career</span>
            </div>
            <div className="lg:text-2xl font-medium lg:ml-16 mb-9 max-w-[640px]">
              Get AI-Powered personalised career guidance based on your
              interests, aptitude, and goals
            </div>
            <Link
              href={"/login"}
              className="flex items-center justify-between bg-[#8C52FF] rounded-full duration-150 hover:scale-[1.02] text-white text-xl md:text-2xl font-semibold py-2 md:py-3 pl-4 md:pl-8 px-2 md:px-3 max-w-[232px] md:max-w-[300px] mb-12 lg:ml-14"
            >
              Let&apos;s Get Started
              <Image
                src={"/home/heroSectionArrow.svg"}
                height={45}
                width={45}
                alt=""
                className="w-8 md:w-10"
              />
            </Link>
            <div className="flex gap-4">
              <div className="hidden xl:flex flex-col bg-[#f5f5f580] hover:bg-[#f1eaff] transition-all duration-200 p-4 rounded-2xl max-w-[260px]">
                <div className="w-full h-[2px] bg-white my-4"></div>
              </div>
            </div>
          </div>
          <div className="lg:block hidden p-6 w-full max-w-[600px] bg-[#ffffff50] rounded-2xl">
            <div className="clock-container flex mx-auto justify-center items-center overflow-hidden w-[500px] h-[500px] relative bg-white">
              <div className="clock flex justify-center items-center w-[340px] h-[340px] absolute border-4 border-dotted border-[#8c52ffaa] rounded-full">
                <Image
                  src={"/recruiter/Image2.png"}
                  alt="Image 2"
                  width={100}
                  height={100}
                  className="clock-image absolute bg-white w-[180px] h-[70px] animate-rotate1"
                />
                <Image
                  src={"/recruiter/Image3.png"}
                  alt="Image 3"
                  width={100}
                  height={100}
                  className="clock-image absolute bg-white w-[180px] h-[70px] animate-rotate2"
                />
                <Image
                  src={"/recruiter/Image1.png"}
                  alt="Image 1"
                  width={100}
                  height={100}
                  className="clock-image absolute bg-white w-[160px] h-[130px] animate-rotate3"
                />
                <Image
                  src={"/recruiter/Image4.png"}
                  alt="Image 4"
                  width={100}
                  height={100}
                  className="clock-image absolute bg-white w-[180px] h-[70px] animate-rotate4"
                />
              </div>
            </div>
          </div>
        </div>
        <InfiniteLogoSlide />
      </div>
    </>
  );
}
