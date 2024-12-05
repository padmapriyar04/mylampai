"use server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/authlib";
import { getTalentPoolData } from "@/actions/talentPoolActions";

export default async function TalentPoolPage({
  params,
}: {
  params: { talentPoolId: string };
}) {
  const user = await auth();

  if (!user || !user.id) redirect("/not-found");
  const res = await getTalentPoolData(params.talentPoolId, user.id);

  if (!res) redirect("/not-found");

  return (
    <div>
      <h1>Talent Pool Page</h1>
      <div>
        <h2>Create Talent Pool</h2>
        
      </div>
    </div>
  );
}
