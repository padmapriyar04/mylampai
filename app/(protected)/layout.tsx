import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/global/Navbar";
import type { Metadata } from "next";
import "../globals.css";
import { Open_Sans } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import Flexsidebar from "@/components/misc/Flexsidebar";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "MyLampAi",
  description: "wiZe - MyLampAi",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = cookies();
  // const token = cookieStore.get("token");

  // if (!token) {
  //   redirect("/login");
  // }

  // try {
  //   if (token.value)
  //     jwt.verify(token?.value as string, process.env.JWT_SECRET as string);
  //   else redirect("/login");
  // } catch (error) {
  //   redirect("/login");
  // }

  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className} bg-primary-foreground`}>
        <AuthProvider>
          <Navbar />
          <div className="flex w-full h-full transition-all duration-300">
            <Flexsidebar />
            {children}
          </div>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}