"use client";
import { usePathname } from "next/navigation";
import navData from "@/components/navbar/navData.json";
import { NavItem } from "@/components/global/NavItems";

export default function Sidebar() {

  const pathname = usePathname();
  const notAllowedRoutes = ["/interview", "/cvreviewer"];

  const isNotAllowed = notAllowedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isNotAllowed) return null;

  return (
    <>
      <div
        className={`bg-white shadow-inner py-2 h-screen z-10 transition-all duration-300 w-full max-w-[220px] flex justify-between items-center gap-2 flex-col`}
      >
        <div className="w-full h-[70vh] flex flex-col justify-evenly mb-0 overflow-y-auto scrollbar-hide ">
          {navData.map((item, index) => {
            return (
              <NavItem
                name={item.name}
                icon={item.icon}
                link={item.link}
                pathname={pathname}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
