import HomeNavbar from "@/components/home/HomeNavbar";

const blogPosts = [
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

export default function Blogs() {
    return (
        <div className="w-full h-full">
            <HomeNavbar />
            <div className="mx-4 lg:mx-8">
                <div className="w-full h-full flex flex-wrap justify-center items-center gap-10 p-6">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="bg-white shadow-lg overflow-hidden w-full sm:w-80 md:w-72 lg:w-64 xl:w-96 h-auto lg:h-[32rem] p-4 space-y-4">
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
