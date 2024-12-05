import type { Metadata } from "next";
import { Page } from "@/components/global/Sidebar";
import { auth } from "@/lib/authlib";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "wiZe (myLampAI)",
  description: "wiZe (myLampAI) - Your career builder",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
        <Page>{children}</Page>
    </>
  );
}
