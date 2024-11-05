"use server";
import prisma from "@/lib";

type SessionData = {
  email: string;
};

type UserData = {
  email: string;
  password: string;
};

export const getCreditBalance = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        credits: true,
        isRegistered: true,
      },
    });

    if (!user) {
      return {
        status: "failed",
      };
    }
    
    return {
      status: "success",
      credits: user.credits,
      isRegistered: user.isRegistered,
    };
  } catch (error) {
    console.log("error ", error);
  }

  return {
    status: "failed",
    message: "Error fetching credits",
  };
};

export const handleCreditUpdate = async (data: SessionData | UserData) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return "failed";
    }

    const isRegistered = user.isRegistered;

    if (isRegistered) return "failed";

    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        credits: 250,
        isRegistered: true,
      },
    });

    return "success";
  } catch (error) {
    console.log("error ", error);
  }
  return "failed";
};

export const handleVerifyRegistration = async ({
  email,
}: {
  email: string;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return false;
    }

    if (user.isRegistered) return true;

    return false;
  } catch (error) {
    console.log("error ", error);
  }
  return false;
};
