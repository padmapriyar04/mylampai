import prisma from "@/lib";
import { auth } from "@/lib/authlib";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  const isTalentProfileExist=await prisma.talentProfile.findFirst({
    where: {
      userId: user?.id,
    },
  });

  if (!user || user?.role !== "user") {
    redirect("/not-found");
  }

  if (!isTalentProfileExist) {
    redirect("/create-profile");
  }else{
    console.log("Talent Profile Exist with userId: ",user?.id);
  }

  

  return <>{children}</>;
}
