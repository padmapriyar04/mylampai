"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/utils/userStore";
import { CommunityComponent, ResourcesComponent, CompanyComponent } from "./HomeNavbarComponents";

const HomeNavbar = () => {
  const [scroll, setScroll] = useState(false);
  const { user } = useUserStore(); 

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

  // Function to get user initials

  const getUserInitials = () => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return null;
  };

  const userInitials = getUserInitials();

  return (
    <>
      <div
        className={`flex justify-between items-center gap-4 ${
          !scroll ? "bg-primary-foreground" : "bg-[#ffffff20]"
        } backdrop-blur-sm transition px-8 py-2 sticky top-0 w-full z-50`}
      >
        <Link
          href={"/"}
          className="grid place-items-center max-w-[200px] w-full"
        >
          <Image
            src={"/home/logo.svg"}
            height={100}
            width={110}
            alt="logo"
            className="w-[200px] drop-shadow-md "
          ></Image>
        </Link>

        <Image
          src={"/home/navbar/list.svg"}
          className="md:hidden block bg-white cursor-pointer shadow-lg rounded-full p-1 w-8 h-8"
          width={10}
          alt="list"
          height={10}
        ></Image>

        <div className="md:flex hidden justify-between bg-[#f9f9f9] items-center w-full max-w-[600px] gap-1 pr-2 pl-4 py-2 backdrop-blur-md font-medium rounded-full shadow-sm">
          <Link
            href={"/"}
            className="hover:bg-primary-foreground transition-all py-2 px-4 rounded-full duration-300  hover:transform "
          >
            Home
          </Link>

          <CommunityComponent />

          <ResourcesComponent />

          <CompanyComponent />          
          
          {userInitials ? (
            <div className="flex items-center bg-[#8C52FF] text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:bg-primary-foreground hover:transform hover:scale-105">
              <span className="font-bold">{userInitials}</span>

              <Image
                src={"/home/userNavbar.svg"}
                alt=""
                height={25}
                width={25}
              />
            </div>
          ) : (
            <Link href={"/login"}>
              <button className="flex items-center bg-[#8C52FF] text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
                Sign In
                <Image
                  src={"/home/userNavbar.svg"}
                  alt=""
                  height={25}
                  width={25}
                />
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeNavbar;
