import type { Metadata } from "next";
import { Page } from "@/components/global/Sidebar";
import { auth } from "@/lib/authlib";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "wiZe (myLampAI)",
  description: "wiZe (myLampAI) - Your career builder",
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  console.log("user", user);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
        <Page>{children}</Page>
    </>
  );
}
