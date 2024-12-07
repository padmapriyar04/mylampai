import { auth } from "@/lib/authlib";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  if (!user || user?.role !== "recruiter") {
    redirect("/not-found");
  }

  return <>{children}</>;
}
