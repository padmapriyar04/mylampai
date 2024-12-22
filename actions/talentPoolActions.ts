"use server";
import prisma from "@/lib";
import { auth } from "@/lib/authlib";

type UserMatchIdsType = {
  talentPoolId: string;
  talentIds: string[];
};

export const getRecruiterTalentPool = async (userId: string) => {
  try {
    const talentPools = await prisma.talentPool.findMany({
      where: {
        userId,
      },
    });

    return talentPools;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTalentPoolData = async (talentPoolId: string) => {
  try {
    const user = await auth();

    if (!user) {
      return null;
    }

    const talentPoolData = await prisma.talentPool.findFirst({
      where: {
        id: talentPoolId,
        userId: user.id,
      },
      select: {
        id: true,
        skills: true,
        profiles: true,
        salary: true,
        locationPref: true,
        talents: true,
      },
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

type TalentPoolDataType = {
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
};

export const matchTalentProfile = async (
  talentPoolData: TalentPoolDataType
) => {
  try {
    const matches = await prisma.talentProfile.findMany({
      where: {
        OR: [{ skills: { hasSome: talentPoolData.skills } }],
      },
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
    });

    return matches;
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
