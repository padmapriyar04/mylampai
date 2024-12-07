import prisma from "@/lib";
import { NextResponse } from "next/server";
import transporter from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 422 }
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `wiZe - Your OTP is ${otp}`,
      text: `Hello,

Your one-time password (OTP) for wiZe is ${otp}. This code is valid for the next 15 minutes.

If you did not request this code, please ignore this email.

Thank you for choosing wiZe!

Best regards,
The wiZe(MyLamp AI) Team`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully!", otpSent: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
