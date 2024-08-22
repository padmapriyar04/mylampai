// pages/api/auth/send-otp.ts
import prisma from "@/lib";
// import { connectToDatabase } from "@/app/helpers/server";
import { NextResponse, NextRequest } from "next/server";
import transporter from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 422 },
      );
    }

    // await connectToDatabase();

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

    try {
      await prisma.oTP.create({
        data: {
          otp,
          expiresAt,
          userId: user.id,
          email
        },
      })

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 15 minutes.`,
      });

      console.log("Message sent: %s", info.messageId);

      return NextResponse.json(
        { message: "OTP sent successfully!" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        { error: "Failed to send OTP" },
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
