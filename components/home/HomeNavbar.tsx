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
import { parse } from "cookie"; // Import parse from the cookie package
import { toast } from "sonner";
import { getCookie } from "@/utils/cookieUtils"; // Import cookie utilities

const HomeNavbar = () => {
  const [scroll, setScroll] = useState(false);
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
      setLoading(false);
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
    <div className={`flex justify-between items-center gap-4 ${!scroll ? "bg-primary-foreground" : "bg-[#ffffff20]"} backdrop-blur-sm transition px-8 py-2 sticky top-0 w-full z-50 h-[64px]`}>
      <Link href={"/"} className="grid place-items-center max-w-[120px] w-full">
        <Image src={"/home/logo.svg"} height={100} width={110} alt="logo" className="w-[120px] drop-shadow-md" />
      </Link>

      {user ? (
        // Logged-in Navbar
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-purple-500 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
            <SlBell className="text-purple-500" />
          </div>
          <Link href="/profile" className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
            <span className="text-black">Account</span>
            <FiUser className="text-purple-500" />
          </Link>
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
            <span className="text-black">Menu</span>
            <BsFillMenuButtonWideFill className="text-purple-500" />
          </div>
        </div>
      ) : (
        // Logged-out Navbar
        <div className="md:flex hidden justify-between bg-[#ffffff90] items-center w-full max-w-[600px] gap-1 pr-2 pl-4 py-2 h-[40px] backdrop-blur-md font-medium rounded-full shadow-sm">
          <Link href={"/"} className="hover:bg-primary-foreground transition-all py-2 px-4 rounded-full duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105">
            Home
          </Link>

          <CommunityComponent />

          <ResourcesComponent />

          <CompanyComponent />

          <Link href={"/login"}>
            <button className="flex items-center bg-[#8C52FF] text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105">
              Sign In
              <Image src={"/home/userNavbar.svg"} alt="" height={25} width={25} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeNavbar;
