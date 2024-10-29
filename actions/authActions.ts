"use server"
import prisma from "@/lib"
import jwt from "jsonwebtoken";

export const handleGoogleLogin = async ({ email }: { email: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      return {
        message: "failed"
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email as string,
        name: user.name as string,
        role: user.role as string,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "70d" },
    );

    const response =
    {
      token,
      user: {
        id: user.id,
        email: user.email as string,
        name: user.name as string,
        role: user.role as string,
      },
    }

    return {
      message: "success",
      response
    };

  } catch (error) {
    console.log("error")
  }
  return {
    message: "failed"
  };
}