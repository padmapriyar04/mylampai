"use client"
import { useState } from 'react';
import HomeNavbar from "@/components/home/HomeNavbar";

type BlogPost = {
    id: number;
    title: string;
    author: string;
    role: string;
    readTime: string;
    readers: string;
    imageUrl: string;
    date: string;
    dpUrl: string;
    topics: string[];
};

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Top 15 Azure DevOps .........",
        author: "Arunav Goswami",
        role: "Data Science ........",
        readTime: "8 mins",
        readers: "288561",
        imageUrl: "/blog/instructor.svg",
        date: "July 27, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["Azure", "DevOps", "Interview"],
    },
    {
        id: 2,
        title: "Understanding JavaScript......",
        author: "Jane Doe",
        role: "Senior Developer",
        readTime: "6 mins",
        readers: "123456",
        imageUrl: "/blog/instructor.svg",
        date: "July 26, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["JavaScript", "Closures", "Advanced"],
    },
    {
        id: 3,
        title: "Styling with Tailwind CSS",
        author: "John Smith",
        role: "Frontend Engineer",
        readTime: "5 mins",
        readers: "78901",
        imageUrl: "/blog/instructor.svg",
        date: "July 25, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["Tailwind CSS", "Styling", "Frontend"],
    },
    {
        id: 4,
        title: "Styling with Tailwind CSS",
        author: "John Smith",
        role: "Frontend Engineer",
        readTime: "5 mins",
        readers: "78901",
        imageUrl: "/blog/instructor.svg",
        date: "July 25, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["Tailwind CSS", "Styling", "Frontend"],
    },
    {
        id: 5,
        title: "Styling with Tailwind CSS",
        author: "John Smith",
        role: "Frontend Engineer",
        readTime: "5 mins",
        readers: "78901",
        imageUrl: "/blog/instructor.svg",
        date: "July 25, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["Tailwind CSS", "Styling", "Frontend"],
    },
    {
        id: 6,
        title: "Styling with Tailwind CSS",
        author: "John Smith",
        role: "Frontend Engineer",
        readTime: "5 mins",
        readers: "78901",
        imageUrl: "/blog/instructor.svg",
        date: "July 25, 2024",
        dpUrl: "/blog/dp.png",
        topics: ["Tailwind CSS", "Styling", "Frontend"],
    }
];

const allTopics = Array.from(new Set(blogPosts.flatMap(post => post.topics)));

export default function Blogs() {
    const [filter, setFilter] = useState<'Most Viewed' | 'Latest' | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const filteredPosts = blogPosts.slice().sort((a, b) => {
        if (filter === 'Most Viewed') {
            return parseInt(b.readers) - parseInt(a.readers);
        } else if (filter === 'Latest') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
    }).filter(post => {
        return selectedTopic ? post.topics.includes(selectedTopic) : true;
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value as 'Most Viewed' | 'Latest' | null);
    };

    const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTopic(event.target.value || null);
    };

    return (
        <div className="w-full h-full">
            <HomeNavbar />
            <div className="mx-4 lg:mx-8 ">
                
            <div className="py-4 text-left my-9 mx-20">
                    <h1 className="text-xl md:text-2xl font-semibold text-black mb-2">Top Articles to Read</h1>
                    <h2 className="text-md md:text-lg font-semibold text-gray-500">Stay updated with data science and engineering trends and insights through our curated articles</h2>
                </div>
                <div className="flex justify-around items-center mx-20 px-2">
                    <div className="flex space-x-4 w-full justify-between text-gray-500">
                        <select
                            value={filter || ''}
                            onChange={handleFilterChange}
                            className=" p-2  rounded-lg border-gray-300  border-[1.5px]"
                        >
                            <option value="">All</option>
                            <option value="Most Viewed">Most Viewed</option>
                            <option value="Latest">Latest</option>
                        </select>
                        <select
                            value={selectedTopic || ''}
                            onChange={handleTopicChange}
                            className=" p-2 rounded-lg border-gray-300 border-[1.5px]"
                        >
                            <option value="" className=' '>All Topics</option>
                            {allTopics.map((topic, index) => (
                                <option key={index} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full h-full flex flex-wrap justify-center items-center gap-10 p-6">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-white overflow-hidden w-full sm:w-80 md:w-72 lg:w-64 xl:w-96 h-auto lg:h-[32rem] p-4 space-y-4">
                            <img
                                className="w-full h-48 object-cover mb-4"
                                src={post.imageUrl}
                                alt={post.title}
                            />
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.topics.map((topic, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{topic}</span>
                                ))}
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold mb-4">{post.title}</h2>
                            <div className="flex items-center mb-4">
                                <img
                                    className="w-10 h-10 rounded-full mr-4"
                                    src={post.dpUrl}
                                    alt={post.author}
                                />
                                <div>
                                    <p className="text-gray-700">{post.author}</p>
                                    <p className="text-gray-500 text-sm">{post.role}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 text-sm">{post.readTime}</span>
                                <span className="text-gray-500 text-sm">{post.readers} readers</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">{post.date}</span>
                                <button className="bg-purple-500 text-white px-3 py-1 rounded">Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
