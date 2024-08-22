"use client";
import React, { useEffect, useRef } from 'react';

export default function About() {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const container = scrollContainerRef.current;
            const rect = container.getBoundingClientRect();

            // Check if the top of the container is within the viewport
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                container.classList.remove("overflow-hidden");
                container.classList.add("overflow-y-auto");
            } else {
                container.classList.remove("overflow-y-auto");
                container.classList.add("overflow-hidden");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {/* First Section */}
            <div className="bg-primary min-h-[calc(100vh-4rem)] w-full flex justify-evenly items-center text-white">
                <div className="max-w-[500px] w-full justify-top h-[300px] relative">
                    <h1 className="font-medium text-5xl">We&apos;re building the future of language AI</h1>
                    <p className="text-2xl mt-10">Cohere empowers every developer and enterprise to build amazing products and capture true business value with language AI.</p>
                </div>
                <div className="bg-gray-700 max-w-[600px] w-full h-[500px] relative left-10"></div>
            </div>

            {/* Second Section */}
            <div className=" relative w-full flex justify-top text-black gap-4 p-4">
                <div className="shadow-2xl sticky top-[5rem] left-0 max-h-[calc(100vh-6rem)] max-w-[20vw] w-full rounded-xl items-center flex flex-col justify-start gap-[1vh]">
                    <div className="bg-gray-400 h-[500px] w-full p-6 rounded-lg">
                        <h1 className="font-bold text-2xl">Our Mission</h1>
                        <p>Just relax and take the interview. All the best!</p>
                        <div className="h-20"></div>
                        <h1 className="font-bold text-2xl relative translate-x-36">Our Vision</h1>
                        <p>Just relax and take the interview. Have your skills evaluated. All the best!</p>
                    </div>

                    <div className="bg-primary-foreground h-[310px] w-full p-6 rounded-lg">
                        <div className="relative flex flex-col justify-evenly left-36 gap-6">
                            <p className="w-1/2 relative max-h-1/2 text-sm">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                            <button className="bg-primary w-1/2 relative top-[2vh] rounded-lg px-4 py-2 font-semibold text-xl text-white">Contact us</button>
                        </div>
                    </div>

                    <div className="bg-violet-400 h-[310px] w-full p-6 rounded-lg">
                        <div className="relative flex flex-col justify-evenly left-36 gap-6">
                            <p className="w-1/2 relative max-h-1/2 text-sm text-gray-600">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                            <button className="bg-primary-foreground w-1/2 relative top-[2vh] rounded-lg px-4 py-2 font-semibold text-xl text-primary">Join us</button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="bg-primary-foreground flex flex-col shadow-2xl w-full rounded-xl p-6 gap-6"
                >
                    <div className='w-full min-h-[500px] flex justify-center items-center'> 
                        content
                    </div>
                    <div className="w-full bg-white min-h-[400px] h-full rounded-lg shadow-lg p-2">
                        <div className="font-bold text-2xl flex justify-end">
                            <h1>Team</h1>
                        </div>
                    </div>
                    <div className="w-full max-h-[400px] min-h-[300px] h-full bg-white rounded-lg shadow-lg p-2">
                        <div className="font-bold text-2xl flex justify-end">
                            <h1>Backers</h1>
                        </div>
                    </div>
                    <div className="w-full max-h-[400px] min-h-[300px] h-full bg-white rounded-lg shadow-lg p-2">
                        <div className="font-bold text-2xl flex justify-end">
                            <h1>ETC</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
