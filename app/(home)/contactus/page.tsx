"use client";
import React, { useState, useEffect } from 'react';

export default function Careers() {
    const [selectedProfile, setSelectedProfile] = useState<null | string>(null);

    const renderForm = () => {
        switch (selectedProfile) {
            case 'type3':
                return <div className="p-4 h-1/2">Form 1</div>;
            case 'type2':
                return <div className="p-4 h-1/2">Form 2</div>;
            case 'type1':
                return <div className="p-4 h-1/2">Form 3</div>;
            default:
                return <div className="p-4 h-1/2">Please select a profile to see the form.</div>;
        }
    };

    return (
        <>
            {/* First Section */}
            <div className="bg-primary min-h-[calc(100vh-4rem)] w-full flex justify-evenly items-center text-white">
                <div className="max-w-[500px] w-full justify-center h-[300px] relative items-center md:mt-16 xl:mt-0">
                    <h1 className="font-medium xl:text-5xl md:text-3xl">We&apos;re building the future of language AI</h1>
                    <p className="xl:text-2xl md:text-md md:mt-3 xl:mt-10 md:pr-24 lg:pr-24">Cohere empowers every developer and enterprise to build amazing products and capture true business value with language AI.</p>
                </div>
                <div className="bg-gray-700 max-w-[34vw] w-full h-[40vh] relative xl:left-10 md:left-0"></div>
            </div>

            {/* Second Section */}
            <div className=" relative w-full flex justify-top text-black gap-4 p-4 bg-white">
                <div className="sticky top-[5rem] left-0 max-h-[calc(100vh-6rem)]  max-w-[20vw] w-full rounded-xl items-center flex flex-col justify-start gap-[2vh]">
                <div className="bg-white h-[calc(40vh-2rem)] w-full 2xl:p-6 md:p-2 rounded-lg flex flex-col shadow-lg justify-evenly">
                        <h2 className="mb-4 font-bold 2xl:text-xl  md:text-m">Profile Selection</h2>
                        <div className='flex flex-col justify-evenly'>
                            <button
                                className={`w-full mb-2 p-2 rounded  2xl:text-md  md:text-sm ${selectedProfile === 'SDE' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                onClick={() => setSelectedProfile('type3')}
                            >
                                Type 1
                            </button>
                            <button
                                className={`w-full mb-2 p-2 rounded  2xl:text-md  md:text-sm  ${selectedProfile === 'AI/ML' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                onClick={() => setSelectedProfile('type2')}
                            >
                                Type 2
                            </button>
                            <button
                                className={`w-full mb-2 p-2 rounded  2xl:text-md  md:text-sm ${selectedProfile === 'Consulting' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                onClick={() => setSelectedProfile('type1')}
                            >
                                Type 3
                            </button>
                        </div>
                    </div>

                    <div className="bg-primary-foreground h-[calc(30vh-2rem)] w-full p-6 rounded-lg shadow-lg flex flex-row justify-evenly">
                        <div className='w-1/2 bg-white flex justify-center items-center'>img</div>
                        <div className="relative flex flex-col justify-evenly gap-6 w-1/2">
                            <p className="w-full relative max-h-1/2 2xl:text-sm  md:text-[0.9vw] ">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                            <button className="bg-primary w-full relative md:top-[-1vw] 2xl:top-[2vh] rounded-lg px-4 py-2 font-semibold 2xl:text-lg md:text-[1vw] text-white ">Contact us</button>
                        </div>
                    </div>

                    <div className="bg-violet-400 h-[calc(30vh-2rem)] w-full p-6 rounded-lg flex shadow-lg flex-row justify-evenly">
                    <div className='w-1/2 bg-white flex justify-center items-center'>img</div>
                    <div className="relative flex flex-col justify-evenly gap-6 w-1/2">
                            <p className="w-full relative max-h-1/2 2xl:text-sm  md:text-[0.9vw] text-gray-600">Just relax and take the interview. Have your skills evaluated. All the best!</p>
                            <button className="bg-primary-foreground w-full relative md:top-[-1vw] 2xl:top-[2vh] rounded-lg px-4 py-2 font-semibold 2xl:text-lg  md:text-[1vw] text-primary">Join us</button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div
                    className="bg-primary-foreground flex flex-col shadow-2xl w-full rounded-xl p-6 gap-6 h-[200vh]"
                >
                    <div className='w-full h-1/2 flex justify-center items-center'> 
                        content
                    </div>
                    <div className="font-bold text-2xl">
                            <h1>We&apos;d love to help!</h1>
                    </div>
                    {renderForm()}

                </div>
            </div>
        </>
    );
}




