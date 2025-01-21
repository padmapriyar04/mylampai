"use client"; 

import { usePathname } from "next/navigation"; 
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/global/Footer";
import BottomNavBar from "@/components/home/BottomNavBar";
import RecruiterNavbar from "@/components/home/RecruiterNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
   <HomeNavbar/>
   <RecruiterNavbar/>   

      <div className="min-h-screen w-full flex flex-1 flex-col">
        {children}
      </div>
      <Footer />

      <BottomNavBar />
    </>
  );
}
