"use server";
import prisma from "@/lib";
import { uploadFileToAzure } from "./uploadActions";

export const getUserResumesList = async (userId: string) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        resumeUrl: true,
        resumeName: true,
      },
    });

    return resumes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addUsersResume = async (formData: FormData, userId: string) => {
  try {
    const resume = formData.get("file") as File;

    if (!resume || !userId) {
      return { status: "failed", message: "Invalid data" };
    }

    const resumeName =
      "resume_" + new Date().toISOString() + "_" + userId + ".pdf";

    const resumeUrl = await uploadFileToAzure(resume, resumeName);

    if (!resumeUrl) {
      return { status: "failed", message: "Invalid data" };
    }

    await prisma.resume.create({
      data: {
        resumeName: resume.name,
        resumeUrl,
        userId,
      },
    });

    return {
      status: "success",
      resumeUrl: resumeUrl,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      message: "Failed to upload resume",
    };
  }
};
