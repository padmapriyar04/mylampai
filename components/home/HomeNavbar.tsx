"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/utils/userStore";

import {
  TalentComponent,
  RecruiterComponent,
  AboutComponent,
} from "./HomeNavbarComponents";

const HomeNavbar = () => {
  const { userData } = useUserStore();
  const [initials, setInitials] = useState("Profile");

  useEffect(() => {
    const getUserInitials = () => {
      if (!userData?.name) return "Profile";

      let name = userData.name;

      let arr = name?.trim().split(" ");

      let initials = "";

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) initials += arr[i][0].toUpperCase();
      }

      return initials;
    };

    setInitials(getUserInitials);
  }, [userData]);

  return (
    <div
      className={`flex justify-between items-center gap-4 bg-[#ffffff20] backdrop-blur-sm transition px-8 fixed top-0 w-full z-50 min-h-[64px]`}
    >
      <Link
        href={"/"}
        className="flex items-center h-11 overflow-hidden max-w-[150px] w-full"
      >
        <Image
          src={"/home/navbar/wizelogo.svg"}
          height={100}
          width={180}
          alt="logo"
          className="w-auto h-full drop-shadow-md"
        />
      </Link>
      <div className="md:flex relative text-sm hidden justify-between border items-center w-full max-w-[600px] gap-1 px-[5px] my-2 min-h-[45px] backdrop-blur-md font-medium rounded-lg shadow-sm">
        <Link
          href={"/"}
          className="transition-all py-2 px-4 rounded-lg duration-300 hover:bg-primary-foreground "
        >
          Home
        </Link>

        <TalentComponent />

        <RecruiterComponent />

        <AboutComponent />

        {userData ? (
          <Link
            href={"/profile"}
            className="flex items-center bg-primary h-[35px] text-white pl-4 pr-2 gap-2 rounded-lg "
          >
            {initials}
            <Image src={"/home/userNavbar.svg"} alt="" height={20} width={20} />
          </Link>
        ) : (
          <Link
            href={"/login"}
            className="flex items-center bg-primary h-[35px] text-white px-4  gap-2 rounded-lg"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeNavbar;
