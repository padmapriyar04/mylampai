"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FaHome } from "react-icons/fa";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Footer from '@/components/home/Footer';
import Carousel from "./crousal";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaThumbsUp, FaShare, FaDownload } from 'react-icons/fa';
interface BlogPost {
    title: string;
    createdAt: string;
    readtime: string;
    authorName: string;
    position: string;
    description: string;
    tags: string[];
    sections: { subheading: string; content: string }[];
}

export default function BlogId({ params }: { params: { blogId: string } }) {
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { blogId } = params;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/blogs/${blogId}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch the blog post');
                }

                const data = await response.json();
                setBlogPost(data.post);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [blogId]);

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


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!blogPost) return <p>No blog post found.</p>;

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
                            {blogPost.tags.map((tag, index) => (
                                <div key={index} className='h-fit py-1 px-4 bg-gray-400 rounded-xl'>{tag}</div>
                            ))}
                        </div>
                    </div>
                    <div className='my-4'>
                        <div className='gap-2 text-5xl my-3'>{blogPost.title}</div>
                        <div className='flex flex-row gap-4 text-md font-[250] text-[#A0A0A0]'>
                            <div>Published: {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}</div>
                            <div>Read Time: {blogPost.readtime}</div>
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
                            <div className='text-lg text-black'>{blogPost.authorName}</div>
                            <div className='text-sm text-gray-600'>{blogPost.position}</div>
                        </div>
                    </div>
                    <div className='my-2'>
                        {blogPost.description}
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
                        onClick={handleReadMore}
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
                <div className="flex flex-col min-h-screen bg-[#FFFF]">
                    <div className="flex flex-1">
                        {/* Left Sidebar */}
                        <div className="w-[20%] hidden md:block p-4 my-10">
                            <div className="relative text-md font-bold mb-6 flex justify-center items-center text-[#8C52FF]">
                                <span className="relative z-10 mb-2">Table of Contents</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1.6px] bg-[#8C52FF]" style={{ width: 'calc(90% - 1rem)', left: '1.5rem' }}></span>
                            </div>
                            <ul className="list-none txt-sm flex flex-col items-center space-y-4">
                                {blogPost.sections.map((section) => (
                                    <li>{section.subheading}</li>
                                ))}
                            </ul>
                           
                            <div className='border-[1.6px] my-2 border-b-black w-[49%] mx-auto'></div>
                            <div className="flex justify-center space-x-4 mt-3 w-full">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                                    <FaFacebookF size={20} color='black' />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                                    <FaTwitter size={20} color='black' />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                                    <FaInstagram size={20} color='black' />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#8C52FF]">
                                    <FaLinkedinIn size={20} color='black' />
                                </a>
                            </div>
                        </div>

                        <div className="w-[60%] px-6 lg:px-[60px] xl:px-[100px] my-8 bg-[#FFFFFF] relative">
                            <div id="allroundassistance" className="pb-[30px] sm:pb-[50px]">
                                <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                                    Why Choose WordPress?
                                </div>
                                <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet nam nobis tenetur vitae placeat inventore, doloremque atque facere molestias doloribus assumenda officiis suscipit hic! Ipsa sit neque eligendi magni explicabo ab, non modi maxime!
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium earum culpa, non corrupti fugit, accusamus animi amet cupiditate illo iste placeat, expedita aut nam eos fugiat! Totam facilis repellat ut ipsam dicta, illum optio sunt accusamus, et tenetur expedita atque possimus? Corrupti ut sed consequuntur sunt, laborum veniam repellat odit nihil perferendis debitis provident maxime assumenda aspernatur quia itaque alias, veritatis accusamus, consectetur deserunt eos voluptate nostrum! Deleniti corrupti amet iure consectetur modi sunt incidunt deserunt ab? Ipsam vitae at eveniet, rem vel possimus dolorum officiis nostrum deleniti minus reprehenderit.
                                </p>
                            </div>
                            <div id="smartestplatform" className="pb-[30px] sm:pb-[50px]">
                                <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                                    WordPress Developer Roadmap (Step-By-Step)
                                </div>
                                <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laudantium tenetur, dicta quae qui cum obcaecati rerum sit? Officia iusto explicabo dolores! Est iure quos saepe aliquam magni accusantium voluptates voluptatem incidunt. Eveniet, perferendis.
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis architecto, tempora suscipit quod culpa exercitationem! Aliquam iste sapiente maiores, totam natus quasi dignissimos perferendis iusto animi odio ipsam dolorem dolorum molestiae quo in repellendus similique ipsum optio laborum ea ullam placeat excepturi. Eum totam ipsum similique tenetur dicta repellat architecto consequatur! Corporis facilis illo sapiente sequi debitis pariatur, delectus esse asperiores ipsa, recusandae laudantium iusto! Corporis explicabo, aspernatur debitis quidem mollitia iure pariatur omnis animi maiores, laboriosam eos repellat fuga atque nostrum ducimus nesciunt dolore fugiat asperiores. Labore, incidunt obcaecati!
                                </p>
                            </div>
                            <div id="ourwinningrecord">
                                <div className="text-2xl sm:text-3xl font-medium mt-4 mb-2">
                                    Conclusion
                                </div>
                                <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ab aspernatur expedita! Provident unde eos a non tempora sit ducimus repellendus officia magnam debitis. Magni ipsam veniam vel est nostrum deleniti consequuntur sunt rem!
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quas quasi suscipit mollitia architecto animi dicta debitis odio praesentium provident excepturi quia nostrum maiores aut, voluptas, aliquam nemo unde commodi cupiditate. Dolorum deserunt culpa, nulla ratione saepe commodi ea hic voluptatibus sit officiis magnam tempore iste tempora ex consectetur quis dolore beatae nobis! Dignissimos odio voluptatibus esse cupiditate iusto non, tempora odit quam. Accusantium cum nihil cumque iusto quam nobis explicabo saepe magni, labore minima, blanditiis ut tempore. Deleniti id ullam cum tempora perspiciatis maxime maiores temporibus perferendis ad illum!
                                </p>
                            </div>

                        </div>

                        {/* Right Sidebar */}
                        <div className="w-[20%] hidden md:block p-4 my-10 mx-4">
                            <div className="text-lg mb-4 font-semibold text-[#8C52FF] shadow-lg py-2">Featured Content :</div>
                            <div className="flex items-start mb-4">
                                <img src="/blog/instructor.svg" alt="Title 1" className="w-[28%] mr-4" />
                                <div>
                                    <h3 className="text-black text-sm">Title 2</h3>
                                    <p className="text-black text-sm">Description for Title 2.</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-start mb-4">
                                    <img src="/blog/instructor.svg" alt="Title 1" className="w-[28%] mr-4" />
                                    <div className="flex-1">
                                        <h3 className="text-black text-sm">Title 2</h3>
                                        <p className="text-black text-sm">Description for Title 2.</p>
                                    </div>
                                </div>
                                <div className="flex items-start mb-4">
                                    <img src="/blog/instructor.svg" alt="Title 2" className="w-[28%] mr-4" />
                                    <div className="flex-1">
                                        <h3 className="text-black text-sm">Title 2</h3>
                                        <p className="text-black text-sm">Description for Title 2.</p>
                                    </div>
                                </div>
                                <div className="flex items-start mb-4">
                                    <img src="/blog/instructor.svg" alt="Title 4" className="w-[28%] mr-4" />
                                    <div className="flex-1">
                                        <h3 className="text-black text-sm">Title 2</h3>
                                        <p className="text-black text-sm">Description for Title 2.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full bg-[#E9DEFF] py-3 px-2 flex justify-center font-semibold text-[#8C52FF] rounded-xl'>
                                <div className='flex justify-center items-center mx-8 w-full'>
                                    Subscribe to Our Newsletter
                                </div>
                            </div>

                            <div className="flex justify-center items-center w-full mt-2 p-2 ">
                                <button className="bg-white text-[#8C52FF] p-2 w-[20%] flex justify-center">
                                    <FaThumbsUp className="text-lg" />
                                </button>
                                <button className="bg-white text-[#8C52FF] p-2 w-[20%] flex justify-center">
                                    <FaShare className="text-lg" />
                                </button>
                                <button className="bg-white text-[#8C52FF] p-2 w-[20%] flex justify-center">
                                    <FaDownload className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <Carousel />
                    <Footer />
                </div>
            </div>
        </div>
    );
}
