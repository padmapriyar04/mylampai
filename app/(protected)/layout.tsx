import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Toaster } from "@/components/ui/sonner";
import HomeNavbar from "@/components/home/HomeNavbar";
import Flexsidebar from "@/components/misc/Flexsidebar";

import type { Metadata } from "next";
import "../globals.css";
import { Open_Sans } from "next/font/google";
const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyLampAi - Home",
  description: "MyLampAi - Home Page",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  try {
    if (token.value)
      jwt.verify(token?.value as string, process.env.JWT_SECRET as string);
    else redirect("/login");
  } catch (error) {
    redirect("/login");
  }
  

  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className} bg-primary-foreground`}>
        <HomeNavbar />
        <Toaster />
        <div className="flex h-full transition-all duration-300 ">
          {/* <Flexsidebar /> */}
          <div className=" flex-1 protected-layout lg:transition-all lg:duration-300">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
