"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from 'react';

export default function WizeCamp() {

  const [isContactOpen, setIsContactOpen] = useState(true);

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  };

  useEffect(() => {
    if (!isContactOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [!isContactOpen]);


  return (
    <>
      <div className={`fixed top-[100vh] min-h-[calc(100vh-4rem)] w-full left-0 right-0 flex justify-center duration-500 z-10 transition ${isContactOpen ? "translate-y-[-300vh]" : "-translate-y-full"}`}>
        <div className="bg-white mt-10 w-[85vw] h-[80vh] flex flex-col items-center justify-center shadow-lg rounded-lg">
          <h1> I am a Reg. Form</h1>
          <button onClick={toggleContact} className="relative text-white font-bold top-[30vh] p-4 border-x-primary-foreground border-4 rounded-xl bg-primary">
            CLOSE FORM
          </button>

        </div>
      </div>

      <div className={` transition ${!isContactOpen ? "blur-sm" : "blur-none"}`}>
        <div className={`bg-primary min-h-[calc(100vh-4rem)] w-full flex justify-evenly items-center text-white p-4 `}>
          <div className="element xl:max-w-[1220px] max-w-[650px] sm:m-auto bg-transperent flex flex-col xl:flex-row justify-around items-center rounded-2xl p-4 sm:p-8 gap-36">
            <div className="bg-[#8C52FF] w-full h-full max-w-[600px] min-h-[500px] flex flex-col items-center justify-evenly rounded-2xl p-4">
              <Image
                src="/home/logoCombined.svg"
                alt="logo"
                width={100}
                height={100}
                className="w-[180px] h-auto mt-6 mb-2"
              ></Image>
              <p className="text-sm font-bold">PRESENTS</p>
              <Image
                src="/home/wizeCamp.svg"
                alt="wizeCamp"
                width={200}
                height={500}
                className="max-w-[450px] h-auto w-full"
              ></Image>
              <p className="text-white text-right w-full max-w-[500px] font-bold tracking-widest">
                A CAREER BOOTCAMP
              </p>
              <div className="flex sm:flex-row flex-col justify-evenly items-center px-2 py-2 my-4 rounded-full text-white text-xs w-full max-w-[420px] bg-[#eeeeee40]">
                <div className="w-full text-center flex flex-col">
                  <div>Camp Schedule </div>
                  <div className="flex justify-center gap-2">
                    {" "}
                    <Image
                      src={"/home/calendar-event.svg"}
                      alt="calendar"
                      width={16}
                      height={16}
                    />{" "}
                    28th Aug - 24th Sep
                  </div>
                </div>
                <div className="w-full text-center flex flex-col">
                  <div>Duration </div>
                  <div className="flex justify-center gap-2">
                    {" "}
                    <Image
                      src={"/home/hourglass.svg"}
                      alt="calendar"
                      width={16}
                      height={16}
                    />{" "}
                    1 Month (on rolling basis)
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex w-full flex-col items-center justify-center gap-4 min-h-[500px] max-w-[516px] relative ">

              <div className="absolute top-1/2 right-1/2 w-[82px] h-[82px] bg-white translate-x-1/2 -translate-y-1/2 rounded-full">
                <Image
                  src="./home/wizecamp/avatar.svg"
                  width={100}
                  height={100}
                  alt="wizecamp"
                  className="w-full h-auto"
                ></Image>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full max-w-[250px] min-h-[242px] rounded-lg bg-white overflow-hidden">
                  <Image
                    src="./home/wizecamp/1.svg"
                    width={100}
                    height={100}
                    alt="wizecamp"
                    className="w-full h-auto"
                  ></Image>
                </div>

                <div className="w-full max-w-[250px] min-h-[242px] rounded-lg bg-white overflow-hidden">
                  <Image
                    src="./home/wizecamp/4.svg"
                    width={100}
                    height={100}
                    alt="wizecamp"
                    className="w-full h-auto"
                  ></Image>
                </div>
              </div>

              <div className="flex flex-row gap-4">

                <div className="w-full max-w-[250px] min-h-[242px] rounded-lg bg-white overflow-hidden">
                  <Image
                    src="./home/wizecamp/3.svg"
                    width={100}
                    height={100}
                    alt="wizecamp"
                    className="w-full h-auto"
                  ></Image>
                </div>
                <div className="w-full max-w-[250px] min-h-[242px] rounded-lg bg-white overflow-hidden">
                  <Image
                    src="./home/wizecamp/2.svg"
                    width={100}
                    height={100}
                    alt="wizecamp"
                    className="w-full h-auto"
                  ></Image>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className=" relative w-full flex justify-top text-black gap-4 p-4 bg-white">



          <div className="sticky top-[5rem] left-0 max-h-[calc(100vh-6rem)]  max-w-[20vw] w-full rounded-xl items-center flex flex-col justify-start gap-[2vh]">
            <div className="bg-white h-[calc(40vh-2rem)] w-full 2xl:p-6 md:p-2 rounded-lg flex shadow-lg justify-center items-center">
              <h1>content</h1>
            </div>

            <div className="bg-primary-foreground h-[calc(30vh-2rem)] w-full p-4 gap-4 rounded-lg shadow-lg flex flex-row justify-evenly">
              <div className='w-1/2 bg-white flex justify-center items-center'>img</div>
              <div className="relative flex flex-col justify-evenly w-1/2">
                <p className="w-full relative max-h-1/2 2xl:text-sm  md:text-[0.9vw] ">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                <button onClick={toggleContact} className="bg-primary w-full relative 2xl:top-[2vh] rounded-lg px-4 py-2 font-semibold 2xl:text-lg md:text-[1vw] text-white">
                  Register
                </button>
              </div>
            </div>

            <div className="bg-violet-400 h-[calc(30vh-2rem)] shadow-lg w-full p-4 gap-4 rounded-lg flex flex-row justify-evenly">
              <div className='w-1/2 bg-white flex justify-center items-center'>img</div>
              <div className="relative flex flex-col justify-evenly w-1/2">
                <p className="w-full relative max-h-1/2 2xl:text-sm  md:text-[0.9vw] text-gray-600">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                <button className="bg-primary-foreground w-full relative 2xl:top-[2vh] rounded-lg px-4 py-2 font-semibold 2xl:text-lg  md:text-[1vw] text-primary">Join us</button>
              </div>
            </div>
          </div>

          {/* Scrollable Container */}
          <div
            className="bg-primary-foreground flex flex-col shadow-2xl w-full rounded-xl p-6 gap-6"
          >
            <div className='w-full min-h-[500px] h-[150vh] flex justify-center items-center'>
              content
            </div>

          </div>
        </div>
      </div>
    </>
  );
}