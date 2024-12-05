"use server";
import prisma from "@/lib";

type TalentPoolData = {
  talentPoolId: string;
  talentIds: string[];
};

export const createTalentPool = async (talentPoolData: TalentPoolData) => {
  try {
    const { talentPoolId, talentIds } = talentPoolData;

    const talentPool = await prisma.talentPool.findFirst({
      where: {
        id: talentPoolId,
      },
    });

    if (!talentPool) {
      return { status: "failed", message: "Talent pool not found" };
    }

    const talentMatchPromises = talentIds.map((talentId) =>
      prisma.talentMatch.create({
        data: {
          talentId,
          talentPoolId,
        },
      })
    );

    await Promise.all(talentMatchPromises);

    return { status: "success", message: "Invites sent successfully" };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      message: "Failed to send invites. Please try again",
    };
  }
};
