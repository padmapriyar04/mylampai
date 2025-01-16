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
  const pathname = usePathname(); // Get current route

  // Check if the current route is under "recruiter"
  const isRecruiterRoute = pathname?.startsWith("/recruiter");

  return (
    <>
     {isRecruiterRoute?<RecruiterNavbar/>:<HomeNavbar/>}
      

      <div className="min-h-screen w-full flex flex-1 flex-col">
        {children}
      </div>
      <Footer />

      {isRecruiterRoute && <BottomNavBar />}
    </>
  );
}
