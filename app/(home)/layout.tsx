import type { Metadata } from "next";
import "./../globals.css";
import { Open_Sans } from "next/font/google";
import Flexsidebar from "@/components/misc/Flexsidebar";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "sonner";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyLampAi - Home",
  description: "MyLampAi - Home Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">

      <body className={`${openSans.className}`}>
        <HomeNavbar />
        <div className="flex h-full transition-all duration-300 ">
          <Flexsidebar />
          <div className=" flex-1 lg:transition-all lg:duration-300">
            {children}
          </div>
        </div>
        <Toaster/>
        <Footer />
      </body>
    </html>
  );
}
