"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import navData from "@/components/navbar/navLinks.json";
import smData from "@/app/data/navsocialicon.json";
import NavLinks from "@/components/navbar/NavItems";

export default function Flexsidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const socialLen = smData.length;
  const navLen = navData.length;
  const navRender = Array(navLen).fill(null);
  const smRender = Array(socialLen).fill(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 640); // Tailwind's sm breakpoint is 640px
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

  return (
    <>
      <div
        ref={sidebarRef}
        className={`bg-white p-4 h-[calc(100vh-4rem)] z-10 transition-all duration-300 w-full max-w-[250px] flex flex-row items-center gap-2 ${isSmallScreen && !isSidebarOpen ? "hidden" : "flex"} flex flex-col w-full transition-all duration-300 z-50 ${isSmallScreen ? "w-screen" : "w-[270px]"}`}
      >
        <button
          className={`absolute top-4 left-4 ${isSmallScreen ? "block" : "hidden"}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <div className="w-full h-[70vh] flex flex-col gap-7 overflow-y-auto scrollbar-hide mr-6 ">
          {navRender.map((item, navindex) => {
            const isActive = pathname === navData[navindex].Link;
            return (
              <div key={navindex}>
                <NavLinks
                  name={navData[navindex].name}
                  icon={navData[navindex].icon}
                  Link={navData[navindex].Link}
                  index={navindex}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-col items-center ">
          <div className="w-12 h-12 border-4 rounded-full border-[#f5f5f5] absolute z-10">
            <Image src="/avtar.svg" alt="pfp" height={50} width={50} />
          </div>
          <div className="w-11/12 h-24 border-2 bg-[#8c52ff] rounded-xl relative top-5"></div>
        </div>
        <div className="w-full h-36 bg-primary-foreground text-lg font-medium flex flex-col justify-center items-center gap-2 relative rounded-lg">
          <span>Connect with us</span>
          <div className="flex flex-row gap-1.5 font-semibold">
            {smRender.map((item, smindex) => (
              <div key={smindex}>
                <div className="w-7 h-7">
                  <Image
                    src={smData[smindex].icon}
                    alt={smData[smindex].name}
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
