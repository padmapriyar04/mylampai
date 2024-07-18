// pages/api/auth/verify-otp.ts
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/index";
import { connectToDatabase } from "@/app/helpers/server";

export const POST = async (req: Request) => {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required fields." },
        { status: 422 }
      );
    }

    await connectToDatabase();

    // Find OTP in database
    const otpRecord = await prisma.oTP.findUnique({ where: { email } });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 422 }
      );
    }

    // Update OTP verification status
    await prisma.oTP.update({
      where: { email },
      data: { verified: true },
    });

    return NextResponse.json({ message: "OTP verified successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
