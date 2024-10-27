"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import navData from "@/components/navbar/navLinks.json";
import smData from "@/app/data/navsocialicon.json";
import NavLinks from "@/components/navbar/NavItems";
import Link from "next/link";

export default function Flexsidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const socialLen = smData.length;
  const navLen = navData.length;
  const navRender = Array(navLen).fill(null);
  const smRender = Array(socialLen).fill(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notAllowedRoutes = [
    "/interview",
    "/cvreviewer"
  ]

  const isNotAllowed = notAllowedRoutes.some((route) => pathname.startsWith(route))

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 640);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleClickOutside = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isNotAllowed) return null;

  return (
    <>
      <div
        ref={sidebarRef}
        className={`bg-white sticky top-[4rem] shadow-inner py-2 h-[calc(100vh-4rem)] z-10 transition-all duration-300 w-full max-w-[220px] flex flex-row items-center gap-2 ${isSmallScreen && !isSidebarOpen ? "hidden" : "flex"} flex flex-col w-full transition-all duration-300 z-10 ${isSmallScreen ? "w-screen" : "w-[270px]"}`}
      >
        <button
          className="absolute top-4 left-4 block sm:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <div className="w-full h-[70vh] flex flex-col justify-evenly mb-0 overflow-y-auto scrollbar-hide ">
          {navRender.map((item, index) => {
            const isActive = pathname === navData[index].Link;
            return (
              <NavLinks
                name={navData[index].name}
                icon={navData[index].icon}
                Link={navData[index].Link}
                index={index}
                key={index}
              />
            );
          })}
        </div>
        <div className="w-full flex flex-col px-2 items-center relative h-28">
          <div className="w-12 h-12 border-4 rounded-full absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 z-10">
            <Image
              src="/avtar.svg"
              alt="pfp"
              height={50}
              width={50}
              className="w-full"
            />
          </div>
          <div className="w-full h-32 bg-primary rounded-lg"></div>
        </div>
        <div className="px-2 w-full">
          <div className="w-full p-4 bg-primary-foreground text-md font-semibold flex flex-col justify-center items-center gap-2 rounded-lg">
            <span>Connect with us</span>
            <div className="flex w-full gap-4 justify-center font-semibold ">
              {smRender.map((item, index) => (
                <Link href={"/"} className="w-6 h-6" key={index}>
                  <Image
                    src={smData[index].icon}
                    alt={smData[index].name}
                    height={100}
                    width={100}
                    className="w-full"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
