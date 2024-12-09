import { getTalentPoolData } from "@/actions/talentPoolActions";
import ProfileMatches from "./ProfileMatches";

export default async function TalentPoolPage({
  params,
}: {
  params: { talentPoolId: string };
}) {
  const res = await getTalentPoolData(params.talentPoolId);

  return (
    <div>
      <h1>Talent Pool Page</h1>

      {res ? (
        <div>
          <ProfileMatches poolData={res} />
        </div>
      ) : (
        <div>No talent pool found</div>
      )}
    </div>
  );
}
