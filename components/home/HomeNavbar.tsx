"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
// import { SlBell } from "react-icons/sl";
// import { FiUser } from "react-icons/fi";
// import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { useUserStore } from "@/utils/userStore";
// import { useRouterStore } from "@/utils/useRouteStore";
import { signOut } from "next-auth/react";
import {
  CommunityComponent,
  ResourcesComponent,
  CompanyComponent,
} from "./HomeNavbarComponents";
// import { useRouter } from "next/navigation";

const HomeNavbar = () => {
  const { data: session } = useSession();
  const [scroll, setScroll] = useState(false);
  const { userData, setUserData } = useUserStore();
  const [initials, setInitials] = useState("Profile");

  const handleScroll = () => {
    if (window.scrollY > 80) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const getToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/getToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user.email }),
      });
      const data = await res.json();

      if (res.ok) {
        setUserData(data.user, data.token);
      }
    } catch (err) {
      console.log(err);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getToken();
    }
  }, [session]);

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
        if (!name) {
          return "Profile";
        }
        let arr = name?.trim().split(" ");

        let initials = "";

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) initials += arr[i][0].toUpperCase();
        }

        return initials;
      } else if (session) {
        let name = session.user.name;

        if (!name) {
          return "Profile";
        }
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
  }, [userData, session]);

  return (
    <div
      className={`flex justify-between items-center gap-4 ${
        !scroll ? "bg-primary-foreground" : "bg-[#ffffff20]"
      } backdrop-blur-sm transition px-8 sticky top-0 w-full z-50 min-h-[64px]`}
    >
      <Link
        href={"/"}
        className="grid place-items-center max-w-[220px] w-full"
      >
        <Image
          src={"/home/logo.svg"}
          height={100}
          width={180}
          alt="logo"
          className="w-full h-auto drop-shadow-md"
        />
      </Link>
      <div className="md:flex hidden justify-between bg-[#ffffff90] items-center w-full max-w-[600px] gap-1 pr-2 my-2 pl-4 py-2 min-h-[40px] backdrop-blur-md font-medium rounded-full shadow-sm">
        <Link
          href={"/"}
          className="transition-all py-2 px-4 rounded-full duration-300 hover:bg-primary-foreground "
        >
          Home
        </Link>

        <CommunityComponent />

        <ResourcesComponent />

        <CompanyComponent />

        {userData || session ? (
          <Link
            href={"/profile"}
            className="flex items-center bg-primary text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
          >
            {initials}
            <Image src={"/home/userNavbar.svg"} alt="" height={25} width={25} />
          </Link>
        ) : (
          <Link
            href={"/login"}
            className="flex items-center bg-primary text-white pl-4 pr-2 py-2 gap-2 rounded-full md:shadow transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
          >
            Sign In
            <Image src={"/home/userNavbar.svg"} alt="" height={25} width={25} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeNavbar;