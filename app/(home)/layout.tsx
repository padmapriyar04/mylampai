"use client"
import "./../globals.css";
import { Open_Sans } from "next/font/google";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react"; 
import Flexsidebar from "@/components/misc/Flexsidebar";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className}`}>
        <SessionProvider>
          <HomeNavbar />
          <div className="flex flex-col min-h-screen bg-cover transition-all duration-300">
            <div className={`flex-1 lg:transition-all lg:duration-300`}>
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
