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
  console.log(matchId);
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

type ExtractedData = {
  personalInfo: {
    [key: string]: string;
  };
  description: string[];
  skills: {
    hard: string[];
    soft: string[];
  };
  education: {
    [key: string]: string;
  }[];
  sections: string[];
  interests: string[];
  projects: {
    [key: string]: string | string[];
  }[];
  workExperience: {
    [key: string]: string | string[];
  }[];
};

// export const updateTalentProfile = async (extractedData: ExtractedData) => {
//   try {
//     await prisma.talentProfile.create({
//       data: extractedData,
//     });

//     return "success";
//   } catch (error) {
//     console.log(error);
//   }
// };

// const generateFileName = (fileName: string, type: string) => {
//   const date = new Date().toISOString();
//   return `${type}-${date}-${fileName}`;
// };

export const uploadResumeToAzure = async (formData: FormData) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        status: "failed",
        message: "User not authenticated",
      };
    }

    const file = formData.get("file") as File;

    const sasUrl = await generateSasToken(file.name);

    if (!sasUrl) {
      return {
        status: "failed",
        message: "Failed to upload Resume",
      };
    }

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
