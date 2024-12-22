"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginComponent from "../global/Login";
import { ArrowRight } from "lucide-react";
import { useRoleStore } from "@/utils/loginStore";

export default function HowWizeWork() {
  const { role, setRole } = useRoleStore();
  const [hovered, setHovered] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [widthPercent, setWidthPercent] = useState(0);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;

    if (!container || !sticky) return;

    const handleScroll = () => {
      const stickyTop = sticky.parentElement?.offsetTop || 0;

      let percentage =
        ((window.scrollY - stickyTop) / window.innerHeight) * 100;

      if (percentage > 200) {
        percentage = 200;
      }
      if (percentage > 170) {
        setActiveTab(3);
      } else if (percentage > 70) {
        setActiveTab(2);
      } else {
        setActiveTab(1);
      }

      if (percentage < 0) {
        percentage = 0;
      }

      container.style.transform = `translateX(calc(-${percentage}vw - 32px))`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="px-8 py-4 ">
      <div className="m-auto max-w-[1300px] h-[100px] flex justify-center items-center w-full gap-4 my-4">
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-white to-primary"></div>
        <div className="w-full text-3xl md:text-4xl font-medium text-center">
          How&nbsp;<span className="text-primary">wiZ</span>e works
        </div>
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] shadow md:max-w-[33%] bg-gradient-to-r from-primary to-white"></div>
      </div>

      <div className="m-auto border rounded-2xl shadow-[0_0px_40px_rgba(140,82,255,0.2)]">
        <div>
          <div className="h-[330vh]">
            <div
              ref={stickyRef}
              className="overflow-hidden sticky top-[64px] h-screen"
            >
              <h2 className="text-center pt-10 pb-2 font-bold text-[32px]">
                Get matched with the right job in just 3 steps
              </h2>
              <p className="text-center mb-6 text-muted-foreground">
                Upload your resume or create a profile, complete the AI
                interview, and get matched with a job or opportunity based on
                your performance
              </p>
              <div className="flex justify-between items-center max-w-[80%] mx-auto text-sm relative">
                <div className="absolute h-[1px] z-0 w-full bg-gray-200">
                  <div
                    className={`h-[1px] z-0 bg-primary transition-all ease-in-out ${
                      activeTab === 1
                        ? "w-0"
                        : activeTab === 2
                        ? "w-1/2"
                        : "w-full"
                    }`}
                  ></div>
                </div>
                <div
                  className={`px-4 py-2 w-full max-w-[160px] text-center font-medium rounded-full z-0 duration-500 ${
                    activeTab === 1
                      ? "text-white bg-primary"
                      : "border border-primary text-muted-foreground bg-white"
                  }`}
                >
                  Upload Resume
                </div>
                <div
                  className={`px-4 py-2 w-full max-w-[160px] text-center font-medium rounded-full border z-10 duration-500 ${
                    activeTab === 3
                      ? "border-primary z-20 bg-white"
                      : activeTab === 2
                      ? "text-white bg-primary"
                      : "text-muted-foreground border-gray-200  bg-white"
                  }`}
                >
                  Give AI Interview
                </div>
                <div
                  className={`px-4 py-2 w-full max-w-[160px] text-center font-medium rounded-full z-10 duration-500 ${
                    activeTab === 3
                      ? "text-white bg-primary"
                      : "text-muted-foreground border-gray-200 border bg-white"
                  }`}
                >
                  Get Hired
                </div>
              </div>
              <div
                ref={containerRef}
                className="absolute top-12 will-change-transform left-0 w-[300vw] h-full flex justify-start items-center"
              >
                <div className="flex flex-col items-center justify-center gap-4 h-[450px] w-[810px] m-auto border rounded-lg">
                  <div className="text-3xl font-bold text-center">
                    Upload Resume
                  </div>
                  <div className="text-lg text-center text-muted-foreground">
                    wiZe is a career guidance platform that helps you find your
                    dream career.
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 h-[450px] w-[810px] m-auto border rounded-lg">
                  <div className="text-3xl font-bold text-center">
                    Give AI Interview
                  </div>
                  <div className="text-lg text-center text-muted-foreground">
                    wiZe is a career guidance platform that helps you find your
                    dream career.
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 h-[450px] w-[810px] m-auto border rounded-lg">
                  <div className="text-3xl font-bold text-center">
                    How wiZe works
                  </div>
                  <div className="text-lg text-center text-muted-foreground">
                    wiZe is a career guidance platform that helps you find your
                    dream career.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-muted-foreground">
              Start your career journey here
            </p>
            <Dialog>
              <DialogTrigger className="z-10">
                <div
                  onClick={() => setRole("user")}
                  className=" flex gap-4 items-center w-[120px] h-[45px] justify-center bg-primary rounded-lg text-white text-sm font-semibold py-2 md:py-3 px-2 md:px-3 md:max-w-[300px] hover:bg-primary-dark"
                >
                  Get matched
                </div>
              </DialogTrigger>
              <DialogContent className="bg-transparent border-none max-w-3xl shadow-none">
                <LoginComponent />
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-center text-muted-foreground my-8">or</div>
          <div>
            <h2 className="text-center mb-2 font-bold text-[32px]">
              Ace Your Next Opportunity the Smarter Way with Us
            </h2>
            <p className="text-center mb-12 text-muted-foreground">
              Either you have to optimise your CV for your next application or
              have to practise for your next interview, improve your chances by
              using our AI CV Reviewer and AI Mock Interviewer
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="border rounded-lg space-y-8 mt-8 flex flex-col min-h-[1050px] justify-between">
            <div className="flex items-start justify-between p-4 gap-4">
              <div
                className={`mt-12 duration-100 flex flex-col gap-4 ${
                  hovered === 1 ? "max-w-[500px]" : "max-w-[550px]"
                }`}
              >
                <h2 className="text-xl font-semibold">AI CV Reviewer</h2>
                <p className="text-muted-foreground">
                  Enhance your resume in just 30 seconds with AI powered CV
                  review for personalized feedback and optimization tips!
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 ">
                    <div className="flex items-center gap-2 w-44">
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                      <span>Detailed feedback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                      <span>Analysis on 10+ parameters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <div className="flex items-center gap-2 w-44">
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                      <span>Fast and accurate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                      <span>Follows industry standards</span>
                    </div>
                  </div>
                </div>
                <div className="space-x-4 mt-2">
                  <Link
                    href="/cvreviewer"
                    className="bg-primary hover:bg-primary-dark w-[118px] text-sm h-10 py-2 px-4 text-white rounded-md"
                  >
                    Try it!
                  </Link>
                  {/* <Link href="/cvreviewer" className="bg-primary hover:bg-primary-dark w-[118px] text-sm h-10 py-2 px-4 text-white rounded-md">Learn More</Link> */}
                </div>
              </div>
              <div
                onMouseEnter={() => setHovered(1)}
                onMouseLeave={() => setHovered(0)}
                className={`rounded-lg bg-[url('/home/herosection/wize_hero.svg')] border shadow-sm w-full bg-cover duration-100 ${
                  hovered === 1
                    ? "max-w-[900px] h-[490px]"
                    : "max-w-[810px] h-[450px]"
                }`}
              ></div>
            </div>
            <div className="flex items-end justify-between p-4 gap-4">
              <div
                onMouseEnter={() => setHovered(2)}
                onMouseLeave={() => setHovered(0)}
                className={`rounded-lg bg-[url('/home/herosection/wize_hero.svg')] border shadow-sm w-full bg-cover duration-100 ${
                  hovered === 2
                    ? "max-w-[900px] h-[490px]"
                    : "max-w-[810px] h-[450px]"
                }`}
              ></div>
              <div
                className={`mb-12 duration-100 text-right gap-4 flex flex-col ${
                  hovered === 2 ? "max-w-[500px]" : "max-w-[550px]"
                }`}
              >
                <h2 className="text-xl font-semibold">AI Mock Interviewer</h2>
                <p className="text-muted-foreground">
                  Practice, perfect, and ace your interviews with personalized
                  practice, real feedback, and real results!
                </p>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span>Fully customizable</span>
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                    </div>
                    <div className="flex items-center justify-end gap-2 w-72">
                      <span>Realistic experience</span>
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span>Built-in compiler</span>
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                    </div>
                    <div className="flex items-center justify-end gap-2 w-72">
                      <span>Detailed analytics and reports</span>
                      <Image
                        src={"/home/howwizework/tick sign.svg"}
                        alt="tick sign"
                        width={16}
                        height={16}
                      ></Image>
                    </div>
                  </div>
                </div>
                <div className="space-x-4 mt-2">
                  <Link
                    href="/interview"
                    className="bg-primary hover:bg-primary-dark w-[118px] text-sm h-10 py-2 px-4 text-white rounded-md"
                  >
                    Try it!
                  </Link>
                  {/* <Link href="/interview" className="bg-primary hover:bg-primary-dark w-[118px] text-sm h-10 py-2 px-4 text-white rounded-md">Learn More</Link> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 my-8">
            <p className="text-center text-muted-foreground">
              Improve your chances
            </p>
            <Button className="hover:bg-primary-dark">Experience it</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
