"use client";
import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import {
  BriefcaseFill,
  CameraVideo,
  CameraVideoFill,
  FileEarmarkText,
  FileEarmarkTextFill,
  House,
  PersonCheck,
  PersonCheckFill,
  PersonFillCheck,
} from "react-bootstrap-icons";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/authlib";

const BottomNavBar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const visibleOn = ["/recruiter"];

  const isVisible = visibleOn.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth();
      if(user){
        setIsLoggedIn(true);
      }
    };
    fetchUser();
  }, []);


  if (!isVisible || !isLoggedIn) return null;

  return (
    <div className="block sm:hidden sticky bottom-0 left-0 w-full bg-white shadow-md rounded-tl-3xl rounded-tr-3xl">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="group flex flex-col items-center text-purple-600">
          <CameraVideo className="w-6 h-6 group-focus:text-primary group-hover:text-primary group-hover:hidden" />
          <CameraVideoFill className="hidden w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:block" />
          <span className="text-xs mt-1 group-hover:text-purple-800">
            Interview
          </span>
        </div>

        <div className="group flex flex-col items-center text-purple-600">
          <PersonCheck className="w-6 h-6 group-hover:fill-purple-800 transition-all group-focus:text-primary group-hover:text-primary group-hover:hidden" />
          <PersonFillCheck className="hidden w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:block" />
          <span className="text-xs mt-1 group-hover:text-purple-800">Talent</span>
        </div>

        <div className="flex justify-center items-center">
          <button className="bg-purple-600 w-12 h-12 rounded-full text-white shadow-md hover:bg-purple-800 transition-all">
            <House className="w-6 h-6 mx-auto" />
          </button>
        </div>

        <div className="group flex flex-col items-center text-purple-600">
          <FileEarmarkText className="w-6 h-6 group-hover:fill-purple-800 transition-all group-focus:text-primary group-hover:text-primary group-hover:hidden" />
          <FileEarmarkTextFill className="hidden w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:block" />
          <span className="text-xs mt-1 group-hover:text-purple-800">
            Recruiter
          </span>
        </div>

        <div className="group flex flex-col items-center text-purple-600">
          <Briefcase className="w-6 h-6 group-hover:fill-purple-800 transition-all group-focus:text-primary group-hover:text-primary group-hover:hidden" />
          <BriefcaseFill className="hidden w-full w-6 h-6 text-[#697386] group-focus:text-primary group-hover:text-primary group-hover:block" />
          <span className="text-xs mt-1 group-hover:text-purple-800">About</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
