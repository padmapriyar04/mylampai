import type { Metadata } from "next";
import "./../globals.css";
import { Open_Sans } from "next/font/google";
import Navbar from "../../components/navbar/Navbar";
import Flexsidebar from "@/components/Flexsidebar";
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
      <body className={`${openSans.className} bg-primary-foreground`}>
        <Navbar />
        <div className="flex h-full transition-all duration-300 ">
          {/* Sidebar */}
          <Flexsidebar />
          {/* Main Content */}
          <div className=" flex-1 lg:transition-all lg:duration-300">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
