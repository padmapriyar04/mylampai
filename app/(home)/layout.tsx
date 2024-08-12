"use client";

import "./../globals.css";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { Open_Sans } from "next/font/google";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "sonner";
import { useUserStore } from "@/utils/userStore"; // Import the Zustand store
import Flexsidebar from "@/components/misc/Flexsidebar"; // Import Flexsidebar

const openSans = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUserStore();
  const pathname = usePathname(); // Get the current path

  // Determine whether to hide the sidebar and/or the navbar
  const hideSidebar = pathname === '/interview' || pathname === '/interviewPage';
  const hideNavbar = pathname === '/interviewPage'; // Only hide the navbar for /interviewPage

  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className}`}>
        {/* Conditionally render HomeNavbar */}
        {!hideNavbar && <HomeNavbar />}
        <div className="flex flex-col min-h-screen bg-cover transition-all duration-300">
          <div className="flex flex-1">
            {/* Conditionally render Flexsidebar */}
            {!hideSidebar && <Flexsidebar />}
            <div className={`flex-1 lg:transition-all lg:duration-300`}>
              {children}
            </div>
          </div>
          {!user && <Footer />} 
        </div>
        <Toaster />
      </body>
    </html>
  );
}
