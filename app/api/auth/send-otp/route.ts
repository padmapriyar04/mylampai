import prisma from "@/lib";
import { connectToDatabase } from "@/app/helpers/server";
import { NextResponse } from "next/server";
import transporter from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 422 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

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

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Recipient's email
        subject: "Your OTP Code", // Subject line
        text: `Your OTP code is ${otp}. It is valid for 15 minutes.`, // Plain text body
      });

      return NextResponse.json(
        { message: "OTP sent successfully!", otpSent: true },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        { error: "Failed to send OTP", otpSent: false },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
