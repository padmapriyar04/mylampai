import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Navbar from "@/components/global/Navbar";
import type { Metadata } from "next";
import Sidebar from "@/components/global/Sidebar";


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
    <>
      {/* <Navbar /> */}
      <div className="flex w-full h-full transition-all duration-300">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
