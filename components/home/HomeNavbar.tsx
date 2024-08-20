"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SlBell } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { useUserStore } from "@/utils/userStore";
import useRouterStore from "../navbar/useRouteStore";
import {
  CommunityComponent,
  ResourcesComponent,
  CompanyComponent,
} from "./HomeNavbarComponents";
import { useRouter } from "next/navigation";
import useInterviewStore from '../../app/(home)/interview/store';

const HomeNavbar = () => {
  const { bears } = useRouterStore();
  const [scroll, setScroll] = useState(false);
  const { userData, setUserData ,clearUser } = useUserStore();
  const [initials, setInitials] = useState("");
  const router = useRouter();
 

  const handleScroll = () => {
    if (window.scrollY > 80) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleLogout = async () =>{
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        clearUser();
        console.log("Logged out successfully");
        router.push("/")
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const getUserInitials = () => {
      if (userData) {
        let name = userData.name;
        let arr = name.trim().split(" ");

        let initials = "";

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) initials += arr[i][0].toUpperCase();
        }

        return initials;
      }
      return "";
    };

    setInitials(getUserInitials);
  }, [userData]);

  if (bears)


  
    return (
      <div
        className={`flex justify-between items-center gap-4 ${
          !scroll ? "bg-primary-foreground" : "bg-[#ffffff20]"
        } backdrop-blur-sm transition px-8 sticky top-0 w-full z-50 min-h-[64px]`}
      >
        <Link
          href={"/"}
          className="grid place-items-center max-w-[220px] w-full "
        >
          <Image
            src={"/home/logo.svg"}
            height={100}
            width={180}
            alt="logo"
            className="w-full h-auto drop-shadow-md"
          />
        </Link>

        {userData ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-purple-500 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
              <SlBell className="text-purple-500" />
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md"
            >
              <span className="text-black">{initials}</span>
              <FiUser className="text-purple-500" />
            </Link>
            <button onClick={handleLogout} >Logout</button>
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
              <span className="text-black">Menu</span>
              <BsFillMenuButtonWideFill className="text-purple-500" />
            </div>
          </div>
        ) : (
          <div className="md:flex hidden justify-between bg-[#ffffff90] items-center w-full max-w-[600px] gap-1 pr-2 my-2 pl-4 py-2 min-h-[40px] backdrop-blur-md font-medium rounded-full shadow-sm">
            <Link
              href={"/"}
              className="hover:bg-primary-foreground transition-all py-2 px-4 rounded-full duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105"
            >
              Home
            </Link>

            <CommunityComponent />

            <ResourcesComponent />

            <CompanyComponent />

            <Link href={"/login"}>
              <button className="flex items-center bg-[#8C52FF] text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105">
                Sign In
                <Image
                  src={"/home/userNavbar.svg"}
                  alt=""
                  height={25}
                  width={25}
                />
              </button>
            </Link>
          </div>
        )}
      </div>
    );
};

export default HomeNavbar;
