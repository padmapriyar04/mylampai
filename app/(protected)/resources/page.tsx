"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ResourceGrid from "@/components/resources/ResourceGrid";

const ResourcePage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 pr-8 mb-8 lg:mb-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <span className="text-purple-600">⌂</span>
              <Link href="/home" className="hover:text-gray-700">
                Home
              </Link>
              <span>›</span>
              <span>Resources</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Dorem ipsum dolor sit amet
            </h1>

            <div className="flex space-x-4 text-sm text-gray-500 mb-6">
              <span>Published: 10/10/24</span>
              <span>Read Time: 5 Minutes</span>
            </div>

            <p className="text-gray-700 mb-8">
              Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Porem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </p>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg">
              DOWNLOAD FILE ↓
            </Button>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-4/5">
              <Image
                src="/path-to-your-image.jpg"
                alt="Resource image"
                width={600}
                height={400}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <ResourceGrid />
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
