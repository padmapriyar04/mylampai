"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function HowWizeWork() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;

    const pin = gsap.fromTo(
      container,
      {
        translateX: 0,
      },
      {
        ease: "none",
        duration: 1,
        translateX: "-200vw",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "1500 top",
          scrub: 1,
          pin: true,
        },
      }
    );

    return () => {
      pin.kill();
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
      <div className="m-auto border p-4">
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
        <div ref={triggerRef} className="overflow-hidden mt-8">
          <div
            ref={containerRef}
            className="w-[calc(300vw)] h-screen flex flex-row relative"
          >
            <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen m-auto border rounded-lg bg-gray-100">
              <div className="text-3xl font-medium text-center">
                How wiZe works
              </div>
              <div className="text-lg text-center text-muted-foreground">
                wiZe is a career guidance platform that helps you find your
                dream career.
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen m-auto border rounded-lg bg-gray-100">
              <div className="text-3xl font-medium text-center">
                How wiZe works
              </div>
              <div className="text-lg text-center text-muted-foreground">
                wiZe is a career guidance platform that helps you find your
                dream career.
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen m-auto border rounded-lg bg-gray-100">
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
