"use server";
import prisma from "@/lib";

export const getUserEducations = async (userId: string) => {
  try {
    if (!userId) return [];
    const educations = await prisma.education.findMany({
      where: {
        userId,
      },
    });

    return educations;
  } catch (error) {
    console.error("Error getting educations:", error);
    return [];
  }
};
