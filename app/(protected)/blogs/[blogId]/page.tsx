"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaHome } from "react-icons/fa";
import Image from 'next/image';
import Read from './readmore';
async function getPost(id) {
    const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
        method: "GET"
    });
    return response.json();
}
export default async function BlogId({ params }) {
    const id = params.blogId;
    const Post = await getPost(id);
    const blogPosts = Post.post;
    return (
        <div className='w-full min-h-[100vh] bg-[#000000] flex flex-col'>
            <div className='w-full h-fit border-b-[2px] border-b-white fixed top-0 left-0 z-10'>
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
                        <div className='gap-2 text-5xl my-3'>{blogPosts.title}</div>
                        <div className='flex flex-row gap-4 text-md font-[250] text-[#A0A0A0]'>
                            <div>Published: {blogPosts.createAt}</div>
                            <div>Read Time: {blogPosts.readtime}</div>
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
                            <div className='text-lg text-black'>{blogPosts.authorName}</div>
                            <div className='text-sm text-gray-600'>{blogPosts.position}</div>
                        </div>
                    </div>
                    <div className='my-2'>
                        {blogPosts.description}
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

                        className='text-white py-2 px-4 rounded-lg'
                    >
                        Read More
                    </button>
                </div>
            </div>
            {/* <div
                ref={contentRef}
                className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                style={{ maxHeight: showMore ? `${contentRef.current?.scrollHeight}px` : '0px' }}
            >
                <Read />
            </div> */}
        </div>
    );
}