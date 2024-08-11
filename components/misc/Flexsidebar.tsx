"use client";
import { useRef, useEffect } from "react";
import Sidebar from "@/components/misc/Sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Flexsidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const handleClickOutside = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      // Optionally handle clicks outside the sidebar if needed
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
      {pathname !== "/" && (
        <div
          ref={sidebarRef}
          className="lg:w-48 z-10 transition-all duration-300 flex flex-row"
        >
          <div className="absolute flex flex-row items-center">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
