"use server";
import prisma from "@/lib";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/nodemailer";

export const handleSendOTP = async (email: string, role: string) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          role,
          emailVerified: new Date(Date.now()),
        },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.oTP.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
      },
      create: {
        email,
        otp,
        expiresAt,
        userId: user.id,
      },
    });

    const sub = "Login | wiZe (myLampAI)";
    const html = `
<h1> Hi ${user.name}, </h1>
<p> Your OTP is: <strong>${otp}</strong> </p>

<p> This OTP is valid for 5 minutes. </p>

<p> If you didn't request this, please ignore this email. </p>

<p> Thanks, </p>
<p> wiZe Team </p>
`;

    const res = await sendEmail(email, sub, html);

    if (res === "success") {
      return {
        message: "OTP sent successfully!",
        otpSent: true,
      };
    }
  } catch (error) {
    console.log("Error", error);
  }
  return {
    message: "failed",
    otpSent: false,
  };
};

export const verifyOTPandLogin = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<{
  otpVerified: boolean;
  message?: string;
  user?: { id: string; email: string };
  accessToken?: string;
}> => {
  try {
    const otpData = await prisma.oTP.findFirst({
      where: {
        otp,
        email,
      },
    });

    if (!otpData) {
      return {
        message: "Invalid OTP",
        otpVerified: false,
      };
    }

    if (otpData.expiresAt < new Date()) {
      return {
        message: "OTP expired",
        otpVerified: false,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        message: "User doesn't exist",
        otpVerified: false,
      };
    }

    await prisma.oTP.delete({
      where: {
        id: otpData.id,
      },
    });

    let accessToken;
    try {
      accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRATION || "70d" },
      );
    } catch (err) {
      console.error("JWT generation error:", err);
      return {
        otpVerified: false,
        message: "Failed to generate access token",
      };
    }

    return {
      otpVerified: true,
      user: {
        id: user.id,
        email: user.email as string,
      },
      accessToken,
    };
  } catch (error) {
    console.error("Error in verifyOTPandLogin:", error);
    return {
      otpVerified: false,
      message: "Internal Server Error",
    };
  }
};

export const handleNextAuthLogin = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        status: "failed",
        message: "User doesn't exists",
      };
    }

    if (user?.emailVerified === null) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          role,
          emailVerified: new Date(Date.now()),
        },
      });
    }

    let accessToken;
    try {
      accessToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRATION || "70d" },
      );
    } catch (err) {
      console.error("JWT generation error:", err);
      return {
        status: "failed",
        message: "Failed to generate access token",
      };
    }

    return {
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      accessToken,
    };
  } catch (error) {
    console.log("error");
    return {
      status: "failed",
      message: "Internal Server Error",
    };
  }
};

export const handleGoogleLogin = async ({ email }: { email: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        message: "failed",
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

    const response = {
      token,
      user: {
        id: user.id,
        email: user.email as string,
        name: user.name as string,
        role: user.role as string,
      },
    };

    return {
      message: "success",
      response,
    };
  } catch (error) {
    console.log("error");
  }
  return {
    message: "failed",
  };
};
