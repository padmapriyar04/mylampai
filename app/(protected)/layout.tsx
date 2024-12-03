import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import type { Metadata } from "next";
import { Page } from "@/components/global/Sidebar";

export const metadata: Metadata = {
  title: "wiZe (myLampAI)",
  description: "wiZe (myLampAI) - Your career builder",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/login");

  try {
    if (token.value)
      jwt.verify(token?.value as string, process.env.JWT_SECRET as string);
    else redirect("/login");
  } catch (error) {
    redirect("/login");
  }

  return (
    <>
        <Page>{children}</Page>
    </>
  );
}
