"use server";
import prisma from "@/lib";
import { generateSasToken } from "./azureActions";
import { auth } from "@/lib/authlib";

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
  try {
    await prisma.talentMatch.update({
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

type StructuredData = {
  title: string;
  description: string;
  skills: string[];
  rate: string;
};

export const createTalentProfile = async (data: StructuredData) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        status: "failed",
        message: "User not authenticated",
      };
    }

    await prisma.talentProfile.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return {
      status: "success",
      message: "Profile created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      message: "Error creating profile",
    };
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
  availability: "FULL_TIME" | "PART_TIME" | "INTERN" | "CONTRACT";
  experienceYears: string;
  userName: string;
};

export const updateTalentProfile = async (
  profileData: ProfileData,
  profileId: string
) => {
  try {
    const user = await auth();

    if (!user) {
      return "failed";
    }

    await prisma.talentProfile.update({
      where: {
        id: profileId,
      },
      data: profileData,
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

export const uploadResumeToAzure = async (formData: FormData) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        status: "failed",
        message: "User not authenticated",
      };
    }

    const date = new Date().toISOString();
    const fileName = `cv-${date}-${user.id}.pdf`;

    const sasUrl = await generateSasToken(fileName);

    if (!sasUrl) {
      return {
        status: "failed",
        message: "Failed to upload Resume",
      };
    }

    const file = formData.get("file") as File;
    const response = await fetch(sasUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
      },
      body: file,
    });

    if (!response.ok) {
      return {
        status: "failed",
        message: "Failed to upload CV",
      };
    }

    const resumeUrl = sasUrl.split("?")[0];

    await prisma.resume.create({
      data: {
        userId: user.id,
        resumeUrl,
      },
    });

    return {
      status: "success",
      message: "CV uploaded successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      message: "Error uploading CV",
    };
  }
};
