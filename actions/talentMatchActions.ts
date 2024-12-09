"use server";
import prisma from "@/lib";

export const getTalentMatches = async (userId: string) => {
  try {
    const talentMatches = await prisma.talentMatch.findMany({
      where: {
        talentId: userId,
      },
    });

    return talentMatches;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const acceptTalentMatch = async (matchId: string) => {
  console.log(matchId);
  try {
    const res = await prisma.talentMatch.update({
      where: {
        id: matchId,
      },
      data: {
        isMatched: true,
      },
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

type ProfileData = {
  resumeId: string;
  interviewId: string;
  skills: string[];
  profiles: string[];
  certifications: string[];
  expectedSalary: string;
  locationPref: "onsite" | "remote" | "hybrid";
  availability: "full-time" | "part-time";
  experienceYears: string;
  userId: string;
  userName: string;
};

export const createTalentProfile = async (profileData: ProfileData) => {
  try {
    await prisma.talentProfile.create({
      data: { ...profileData },
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const getTalentProfiles = async (userId: string) => {
  try {
    const talentProfile = await prisma.talentProfile.findMany({
      where: {
        userId,
      },
    });

    return talentProfile;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getResumeAndInterviewIds = async (userId: string) => {
  try {
    const cvIds = await prisma.cV.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const interviewIds = await prisma.interview.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return {
      status: "success",
      cvIds,
      interviewIds,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      cvIds: [],
      interviewIds: [],
    };
  }
};
