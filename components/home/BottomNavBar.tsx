import React from "react";
import { Home, Folder, Layout, Crown, Plus } from "lucide-react";

const BottomNavBar = () => {
  return (
    <div className="block sm:hidden sticky bottom-0 left-0 w-full bg-white shadow-md rounded-bl-3xl rounded-br-3xl">
      <div className="flex justify-between items-center px-4 py-3 ">
        <div className="group flex flex-col items-center text-purple-600">
          <Home
            className="w-6 h-6 stroke-purple-600 group-hover:fill-purple-800 group-hover:stroke-white transition-all"
          style={{strokeWidth:2}}
          />
          <span className="text-xs mt-1 group-hover:text-purple-800">Home</span>
        </div>

        {/* Projects */}
        <div className="group flex flex-col items-center text-purple-600">
          <Folder
            className="w-6 h-6 stroke-purple-600 group-hover:fill-purple-800  transition-all"
         
          />
          <span className="text-xs mt-1 group-hover:text-purple-800">Talent</span>
        </div>

        {/* Add Button */}
        <div className="flex justify-center items-center">
          <button className="bg-purple-600 w-12 h-12 rounded-full text-white shadow-md hover:bg-purple-800 transition-all">
            <Plus className="w-6 h-6 mx-auto" />
          </button>
        </div>

        {/* Templates */}
        <div className="group flex flex-col items-center text-purple-600">
          <Layout
            className="w-6 h-6 stroke-purple-600 group-hover:fill-purple-800  transition-all"
            
          />
          <span className="text-xs mt-1 group-hover:text-purple-800">Recruiter</span>
        </div>

        {/* Pro */}
        <div className="group flex flex-col items-center text-purple-600">
          <Crown
            className="w-6 h-6 stroke-purple-600 group-hover:fill-purple-800  transition-all"
          />
          <span className="text-xs mt-1 group-hover:text-purple-800">About</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
