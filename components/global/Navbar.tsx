"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { userData, clearUser } = useUserStore();
  const router = useRouter();
  const [initials, setInitials] = useState("Profile");

  const hiddenOn = ["/interview/"];

  const isHidden = hiddenOn.some((route) => pathname.startsWith(route));

  const handleLogout = async () => {
    try {
      if (session) {
        await signOut();
        clearUser();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } else {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });
        if (response.ok) {
          clearUser();
          toast.success("Logged out successfully");
          router.push("/");
        } else {
          console.error("Logout failed:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleToast = (message: string) => {
    toast.success(message);
  };

  const getUserInitials = useCallback(() => {
    if (userData) {
      let name = userData.name;
      if (!name) return "Profile";
      let arr = name.trim().split(" ");

      let initials = "";

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) initials += arr[i][0].toUpperCase();
      }

      return initials;
    } else if (session) {
      let name = session.user.name;
      if (!name) return "Profile";
      let arr = name.trim().split(" ");

      let initials = "";

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) initials += arr[i][0].toUpperCase();
      }

      return initials;
    }
    return "";
  }, [userData, session]);

  useEffect(() => {
    setInitials(getUserInitials());
  }, [getUserInitials]);

  if (isHidden) return null;

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
        <button
          className="flex items-center gap-2 border-[1px] border-primary rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-105"
          onClick={() => handleToast("No notifications available")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#8C52FF"
            className="bi bi-bell-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
          </svg>
        </button>
        <Link
          href="/profile"
          className="flex items-center gap-2 border-[1px] border-primary rounded-full px-4 py-2 h-[40px] transition-transform transform hover:scale-105"
        >
          <span className="">{initials}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#8C52FF"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </Link>
        <button className="flex items-center gap-2 border-[1px] border-primary rounded-full px-4 py-2 h-[40px] duration-200 transition-transform  hover:scale-105 ">
          <span className="">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#8C52FF"
            className="bi bi-menu-button-wide-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h13A1.5 1.5 0 0 0 16 3.5v-2A1.5 1.5 0 0 0 14.5 0zm1 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m9.927.427A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
        <button
          className="flex items-center gap-2 border-[1px] border-primary rounded-full px-2 py-2 h-[40px] transition-transform transform hover:scale-105 "
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#8C52FF"
            className="bi bi-box-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
            />
            <path
              fillRule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
