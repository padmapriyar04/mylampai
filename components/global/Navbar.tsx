"use client";
import Image from "next/image";
import Link from "next/link";
import { SlBell } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { useUserStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import { useRouterStore } from "@/utils/useRouteStore";

const Navbar = () => {
  const { userData, clearUser } = useUserStore();
  const { bears } = useRouterStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        clearUser();
        console.log("Logged out successfully");
        router.push("/");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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

  const initials = getUserInitials();

  if (bears)
    return (
      <div className="flex shadow-sm bg-white justify-between z-20 items-center gap-4 backdrop-blur-sm transition pr-8 sticky top-0 w-full h-[4rem]">
        <Link
          href={"/"}
          className="grid place-items-center max-w-[200px] w-full h-full"
        >
          <Image
            src={"/home/logo.svg"}
            height={100}
            width={180}
            alt="logo"
            className="w-full h-auto drop-shadow-md"
          />
        </Link>

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
          <button>Logout</button>
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-110 hover:shadow-md">
            <span className="text-black">Menu</span>
            <BsFillMenuButtonWideFill className="text-purple-500" />
          </div>
        </div>
      </div>
    );
};

export default Navbar;
