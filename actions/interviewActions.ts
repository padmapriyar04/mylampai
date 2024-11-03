"use server";
import prisma from "@/lib";

export const getInterviews = async (userId: string) => {
  try {
    if (!userId) return [];

    const interviews = await prisma.interview.findMany({
      where: { userId },
      select: {
        id: true,
      },
    });

    return interviews;
  } catch (error) {
    console.log("Error: ", error);
  }
  return [];
};

export const createInterview = async (userId: string) => {
  try {
    if (!userId)
      return {
        status: "failed",
      };

    const interview = await prisma.interview.create({
      data: {
        userId,
      },
    });

    return {
      status: "success",
      interviewId: interview.id,
    };
  } catch (error) {
    console.log("Error: ", error);
  }
  return {
    status: "failed",
  };
};

export const handleCVUpload = async ({
  cvText,
  interviewId,
}: {
  cvText: string;
  interviewId: string;
}) => {
  try {
    if (!interviewId || !cvText) {
      return {
        status: "failed",
        message: "CV or User not found",
      };
    }

    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        cvText,
      },
    });

    return {
      status: "success",
      message: "CV Uploaded",
      interviewId: interview.id,
    };
  } catch (error) {
    console.log("Error: ", error);
  }

  return {
    status: "failed",
    message: "Internal Server Error",
  };
};

export const handleJDTextUpload = async ({
  jdText,
  interviewId,
}: {
  jdText: string;
  interviewId: string;
}) => {
  try {

    if (!jdText || !interviewId) {
      return {
        status: "failed",
        message: "JD or InterviewId not found",
      };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        jdText,
      },
    });

    return {
      message: "JD Updated",
      status: "success",
    };
  } catch (error) {
    console.log("Error: ", error);
  }

  return {
    status: "failed",
    message: "Internal Server Error",
  };
};
