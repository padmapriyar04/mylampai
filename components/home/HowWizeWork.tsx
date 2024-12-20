"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";

export default function HowWizeWork() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;

    if (!container || !sticky) return;

    const handleScroll = () => {
      const stickyTop = sticky.parentElement?.offsetTop || 0;

      let percentage = ((window.scrollY - stickyTop) / window.innerHeight) * 100;

      if (percentage > 200) percentage = 200;
      if (percentage < 0) percentage = 0;

      container.style.transform = `translateX(-${percentage}vw)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="m-auto max-w-[1300px] h-[100px] flex justify-center items-center w-full gap-4">
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-white to-primary"></div>
        <div className="w-full text-3xl md:text-4xl font-medium text-center">
          How&nbsp;<span className="text-primary">wiZ</span>e works
        </div>
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] shadow md:max-w-[33%] bg-gradient-to-r from-primary to-white"></div>
      </div>
      <div className="m-auto border">
        <div className="flex justify-between items-center">
          <div className="px-6 py-1 font-medium text-muted-foreground  rounded-full bg-primary text-white">
            Jelly
          </div>
          <div className="w-full h-[2px] bg-gray-200"></div>
          <div className="px-6 py-1 font-medium text-muted-foreground rounded-full border shadow-[0px_0px_1px_rgba(0,0,0,0.7)]">
            Jelly
          </div>
          <div className="w-full h-[2px] bg-gray-200"></div>
          <div className="px-6 py-1 font-medium text-muted-foreground rounded-full border shadow-[0px_0px_1px_rgba(0,0,0,0.7)]">
            Jelly
          </div>
        </div>
        <div className="h-[300vh]">
          <div
            ref={stickyRef}
            className="overflow-hidden sticky top-0 h-screen"
          >
            <div
              ref={containerRef}
              className="absolute top-0 will-change-transform left-0 w-[300vw] h-full flex justify-between items-center"
            >
              <div className="flex flex-col items-center justify-center gap-4 h-[500px] w-[400px] m-auto border rounded-lg bg-gray-100">
                <div className="text-3xl font-medium text-center">
                  How wiZe works
                </div>
                <div className="text-lg text-center text-muted-foreground">
                  wiZe is a career guidance platform that helps you find your
                  dream career.
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 h-[500px] w-[400px] m-auto border rounded-lg bg-gray-100">
                <div className="text-3xl font-medium text-center">
                  How wiZe works
                </div>
                <div className="text-lg text-center text-muted-foreground">
                  wiZe is a career guidance platform that helps you find your
                  dream career.
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 h-[500px] w-[400px] m-auto border rounded-lg bg-gray-100">
                <div className="text-3xl font-medium text-center">
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
        <div className="border space-y-8 mt-8">
          <div className="flex items-start justify-between p-4 gap-4">
            <div className="mt-12 max-w-[400px]">
              <h2 className="text-xl font-semibold">Hello World</h2>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam
                beatae cumque eveniet maiores blanditiis sed architecto quam
                temporibus mollitia corporis laudantium nam suscipit, eum iure
                officia tenetur, in possimus quae consequuntur praesentium.
                Recusandae, consequuntur.
              </p>
            </div>
            <div className="rounded-lg bg-[url('/home/herosection/wize_hero.svg')] border shadow-sm w-full max-w-[600px] h-[400px] hover:max-w-[800px] hover:h-[533px] bg-cover duration-300"></div>
          </div>
          <div className="flex items-start justify-between p-4 gap-4">
            <div className="rounded-lg bg-[url('/home/herosection/wize_hero.svg')] border shadow-sm w-full max-w-[600px] h-[400px] hover:max-w-[800px] hover:h-[533px] bg-cover duration-300"></div>
            <div className="mt-12 max-w-[400px]">
              <h2 className="text-xl font-semibold">Hello World</h2>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam
                beatae cumque eveniet maiores blanditiis sed architecto quam
                temporibus mollitia corporis laudantium nam suscipit, eum iure
                officia tenetur, in possimus quae consequuntur praesentium.
                Recusandae, consequuntur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
