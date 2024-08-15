"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/userStore";
import { SlBell } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import {
  CommunityComponent,
  ResourcesComponent,
  CompanyComponent,
} from "./HomeNavbarComponents";
import { getCookie } from "@/utils/cookieUtils";

const HomeNavbar = () => {
  const [scroll, setScroll] = useState(false);
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const handleScroll = () => {
    if (window.scrollY > 80) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = getCookie("user"); // Use getCookie to retrieve user data
      if (userData) {
        setUser(JSON.parse(userData), "");
      } else {
        setUser(null, "");
      }
    };

    fetchUserData();
  }, [setUser]);

  // Function to get user initials
  const getUserInitials = () => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return null;
  };

  const userInitials = getUserInitials();

  return (
    <div
      className={`flex justify-between items-center gap-4 ${
        !scroll ? "bg-primary-foreground" : "bg-[#ffffff20]"
      } backdrop-blur-sm transition px-8 sticky top-0 w-full z-50 min-h-[64px]`}
    >
      <Link href={"/"} className="grid place-items-center max-w-[220px] w-full ">
        <Image
          src={"/home/logo.svg"}
          height={100}
          width={180}
          alt="logo"
          className="w-full h-auto drop-shadow-md"
        />
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-purple-500 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
            <SlBell className="text-purple-500" />
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md"
          >
            <span className="text-black">Account</span>
            <FiUser className="text-purple-500" />
          </Link>
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