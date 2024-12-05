"use server";
import prisma from "@/lib";

type UserMatchIdsType = {
  talentPoolId: string;
  talentIds: string[];
};

export const getTalentPoolData = async (talentPoolId: string, userId: string) => {
  try {
    const talentPoolData = await prisma.talentPool.findFirst({
      where: {
        id: talentPoolId,
        userId,
      },
      select: {
        id: true,
        skills: true,
        profiles: true,
        salary: true,
        locationPref: true,
        experienceNeeded: true,
        talents: true,
      }
    });

    return talentPoolData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTalentPoolsData = async (targetPoolIds: string[]) => {
  try {
    const talentPoolsData = await prisma.talentPool.findMany({
      where: {
        id: {
          in: targetPoolIds,
        },
      },
    });

    return talentPoolsData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

type TalentPoolType = {
  userId: string;
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
  experienceNeeded: string;
};

export const createTalentPool = async (talentPool: TalentPoolType) => {
  try {
    await prisma.talentPool.create({
      data: { ...talentPool },
    });

    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
};

export const addUsersInTalentPool = async (userMatchIds: UserMatchIdsType) => {
  try {
    const { talentPoolId, talentIds } = userMatchIds;

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
