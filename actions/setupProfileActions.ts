"use server";
import prisma from "@/lib/index";
import { Education, Employment, Language } from "@prisma/client";

export const addProfiles = async (
  profiles: string[],
  talentProfileId: string
) => {
  try {
    await prisma.talentProfile.update({
      where: {
        id: talentProfileId,
      },
      data: {
        profiles,
      },
    });

    return {
      message: "Profile added successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error adding profile:", error);
    return {
      error: "Error adding profile",
      status: 500,
    };
  }
};

export const addSkills = async (skills: string[], talentProfileId: string) => {
  try {
    await prisma.talentProfile.update({
      where: {
        id: talentProfileId,
      },
      data: {
        skills,
      },
    });

    return {
      message: "Skills added successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error adding skills:", error);
    return {
      error: "Error adding skills",
      status: 500,
    };
  }
};

export const updateTitle = async (title: string, talentProfileId: string) => {
  try {
    await prisma.talentProfile.update({
      where: {
        id: talentProfileId,
      },
      data: {
        title,
      },
    });

    return {
      message: "Job title updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating job title:", error);
    return {
      error: "Error updating job title",
      status: 500,
    };
  }
};

export const createEmployments = async (
  employments: Employment[],
  talentProfileId: string
) => {
  try {
    await prisma.employment.createMany({
      data: employments.map((employment) => ({
        ...employment,
        talentProfileId,
      })),
    });

    return {
      message: "Employments added successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error adding employments:", error);
    return {
      error: "Error adding employments",
      status: 500,
    };
  }
};

export const createEducation = async (
  education: Education[],
  userId: string
) => {
  try {
    await prisma.education.createMany({
      data: education.map((education) => ({
        ...education,
        userId,
      })),
    });

    return {
      message: "Education added successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error adding education:", error);
    return {
      error: "Error adding education",
      status: 500,
    };
  }
};

export const createLanguages = async (
  languages: Language[],
  userId: string
) => {
  try {
    await prisma.language.createMany({
      data: languages.map((language) => ({
        ...language,
        userId,
      })),
    });

    return {
      message: "Languages added successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error adding languages:", error);
    return {
      error: "Error adding languages",
      status: 500,
    };
  }
};

export const updateDescription = async (
  description: string,
  talentProfileId: string
) => {
  try {
    await prisma.talentProfile.update({
      where: {
        id: talentProfileId,
      },
      data: {
        description,
      },
    });

    return {
      message: "Description updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating description:", error);
    return {
      error: "Error updating description",
      status: 500,
    };
  }
};

export const updateHourlyRate = async (
  rate: string,
  talentProfileId: string
) => {
  try {
    await prisma.talentProfile.update({
      where: {
        id: talentProfileId,
      },
      data: {
        rate,
      },
    });

    return {
      message: "Hourly rate updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating hourly rate:", error);
    return {
      error: "Error updating hourly rate",
      status: 500,
    };
  }
};

type UserProfileData = {
  image: string;
  dateOfBirth: Date;
  phone: string;
  street: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
};

export const updateProfile = async (
  userProfileData: UserProfileData,
  userId: string
) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userProfileData,
      },
    });

    return {
      message: "Profile updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      error: "Error updating profile",
      status: 500,
    };
  }
};
