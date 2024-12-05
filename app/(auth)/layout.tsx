import type { Metadata } from "next";
import { auth } from "@/lib/authlib";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "wiZe (myLampAI) | Login",
  description: "wiZe (myLampAI) | Sign In/Up Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = auth();

  if (user) {
    redirect("/home");
  }

  return (
    <>
      <main className="h-full">{children}</main>
    </>
  );
}
