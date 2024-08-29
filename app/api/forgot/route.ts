import prisma from "@/lib";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 422 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Create JWT token with user ID and expiration of 1 hour
    const resetToken = jwt.sign({ id: user.id }, process.env.RESET_TOKEN_SECRET as string, {
      expiresIn: "1h",
    });

    // Create the reset URL with the token
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Send the reset link via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click here to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return NextResponse.json({ message: "Password reset link sent." }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
