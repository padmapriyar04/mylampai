// app/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import React from "react";
import Navbar from "./../../app/components/navbar/Navbar";
import Flexsidebar from "./../../app/components/Flexsidebar";

import type { Metadata } from "next";
import "./../globals.css";
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
    jwt.verify(token?.value || "", process.env.JWT_SECRET || "okokokok");
  } catch (error) {
    redirect("/login");
  }

  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className} bg-primary-foreground`}>
        <Navbar />
        <div className="flex h-full transition-all duration-300 ">
          {/* Sidebar */}
          <Flexsidebar />
          {/* Main Content */}
          <div className=" flex-1 protected-layout lg:transition-all lg:duration-300">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
