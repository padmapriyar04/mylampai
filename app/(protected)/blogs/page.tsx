"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  authorName: string;
  position: string;
  readtime: string;
  createdAt: string;
  tags: string[];
}

export default function BlogList() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blogs", {
          method: "GET",

        });

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (blogPosts.length === 0) return <p>No blogs found</p>;

  return (
    <div className="w-full h-full">
      <div className="mx-4 lg:mx-8">
        <div className="py-4 text-left my-9 mx-20">
          <div className="flex flex-row">
            <div className="text-xl md:text-2xl font-semibold text-black mb-2">
              Top Articles to
            </div>
            <div className="text-xl md:text-2xl border-3 border-b-purple-500 h-fit font-semibold text-black mx-3 -mt-2">
              {" "}
              Read{" "}
            </div>
          </div>
          <h2 className="text-md md:text-lg font-semibold text-gray-500">
            Stay updated with data science and engineering trends and insights
            through our curated articles
          </h2>
        </div>
        <div className="w-full h-full flex flex-wrap justify-center items-center gap-10 p-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white overflow-hidden w-full sm:w-80 md:w-72 lg:w-64 xl:w-96 h-auto lg:h-[32rem] p-4 space-y-4"
            >
              <Image
                height={100}
                width={100}
                className="w-full h-48 object-cover mb-4"
                src="/blog/instructor.svg"
                alt={post.title}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                {post.title}
              </h2>
              <div className="flex items-center mb-4">
                <Image
                  height={100}
                  width={100}
                  className="w-10 h-10 rounded-full mr-4"
                  src="/blog/dp.png"
                  alt={post.authorName}
                />
                <div>
                  <p className="text-gray-700">{post.authorName}</p>
                  <p className="text-gray-500 text-sm">{post.position}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">{post.readtime}</span>
                <span className="text-gray-500 text-sm">12345 readers</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleClick(post.id)}
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
