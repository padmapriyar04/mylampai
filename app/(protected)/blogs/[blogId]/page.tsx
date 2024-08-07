"use client";
import React, { useState, useRef, useEffect } from 'react';
import HomeNavbar from './bloghomebar';
import { FaHome } from "react-icons/fa";
import Image from 'next/image';
import Read from './readmore';
import Carousel from "./crousal";

const BlogId: React.FC = () => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleReadMore = () => {
        setShowMore(!showMore);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = showMore ? `${contentRef.current.scrollHeight}px` : '0px';
        }
    }, [showMore]);

    return (
        <div className='w-full min-h-[100vh] bg-[#000000] flex flex-col'>
            <div className='w-full h-fit border-b-[2px] border-b-white fixed top-0 left-0 z-10'>
                <HomeNavbar />
            </div>
            <div className='w-full flex-1 text-white flex flex-col md:flex-row justify-between mt-[4rem] px-8 md:px-32 py-16'>
                <div className='text-white w-full md:w-[40%] flex flex-col gap-4 bg-black mx-2 p-4 rounded-xl'>
                    <div className='w-full flex flex-col gap-1'>
                        <div className='w-full flex flex-row gap-1 my-8'>
                            <FaHome size={24} color='#8C52FF' />
                            <h1>Home</h1>
                            <span className='text-[#8C52FF] h-fit'>&gt;</span>
                            <h1>Blogs</h1>
                            <span className='text-[#8C52FF] h-fit'>&gt;</span>
                            <h1>ABC</h1>
                        </div>
                        <div className='flex gap-2 text-black text-sm'>
                            <div className='h-fit py-1 px-4 bg-gray-400 rounded-xl'>Category 1</div>
                            <div className='h-fit py-1 px-4 bg-gray-400 rounded-xl'>Category 2</div>
                        </div>
                    </div>
                    <div className='my-4'>
                        <div className='gap-2 text-5xl my-3'>Lorem ipsum dolor sit amet</div>
                        <div className='flex flex-row gap-4 text-md font-[250] text-[#A0A0A0]'>
                            <div>Published: 10/10/24</div>
                            <div>Read Time: 5 Minutes</div>
                        </div>
                    </div>
                    <div className='bg-[#A0A0A0] rounded-xl max-w-[250px] max-h-32 h-20 flex items-center py-3 px-4'>
                        <div className='flex-shrink-0'>
                            <Image
                                className='h-12 w-12 rounded-full object-cover bg-red-400'
                                src='/blog/instructor.svg'
                                alt='Profile'
                                width={48}
                                height={48}
                            />
                        </div>
                        <div className='ml-4'>
                            <div className='text-lg text-black'>John Doe</div>
                            <div className='text-sm text-gray-600'>Author Qualification</div>
                        </div>
                    </div>
                    <div className='my-2'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
                <div className='w-full md:w-[55%] bg-[#D9D9D9] text-black rounded-xl min-h-[350px] h-[60vh] md:h-[60%] flex justify-center items-center my-8 md:my-auto'>
                    {/* Main Content Area */}
                </div>
            </div>
            <div className='w-full px-8 md:px-32 py-4 -mt-6'>
                <hr className='border-white' />
                <div className='text-center text-white mt-4'>
                    <button
                        onClick={handleReadMore}
                        className='text-white py-2 px-4 rounded-lg'
                    >
                        Read More
                    </button>
                </div>
            </div>
            <div
                ref={contentRef}
                className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                style={{ maxHeight: showMore ? `${contentRef.current?.scrollHeight}px` : '0px' }}
            >
                <Read />
            </div>
        </div>
    );
}

export default BlogId;
