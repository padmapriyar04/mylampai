import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const ResourceGrid: React.FC = () => {
  const [featuredOpen, setFeaturedOpen] = useState(false);

  const filters = [
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
  ];
  const featuredContent = [
    "Lorem Ipsum Lorem Lorem...",
    "Lorem Ipsum Lorem Lorem...",
    "Lorem Ipsum Lorem Lorem...",
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="w-full md:w-2/5 pr-4 mb-8 md:mb-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full mb-4 justify-between bg-purple-100 text-purple-600">
              Apply Filters <span>›</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {filters.map((filter, index) => (
              <DropdownMenuCheckboxItem key={index}>
                <Checkbox id={`filter-${index}`} />
                <label htmlFor={`filter-${index}`} className="ml-2">
                  {filter}
                </label>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => setFeaturedOpen(!featuredOpen)}
          className="w-full mb-4 justify-between bg-purple-100 text-purple-600"
        >
          Featured Content <span>›</span>
        </Button>
        {featuredOpen && (
          <div className="bg-white shadow-md rounded p-4">
            {featuredContent.map((content, index) => (
              <div
                key={index}
                className="mb-2 p-2 border rounded flex items-center"
              >
                <div className="w-8 h-8 bg-red-200 rounded mr-2"></div>
                <span>{content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="w-full md:w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(21)].map((_, index) => (
            <ResourceCard key={index} />
          ))}
        </div>
      </div>

      {/* Full-width rectangle at the bottom */}
      {/* <div className="w-full h-24 bg-gray-300 rounded-lg mt-8"></div> */}
    </div>
  );
};

const ResourceCard: React.FC = () => (
  <div className="bg-gray-300 rounded-lg aspect-video"></div>
);

export default ResourceGrid;
