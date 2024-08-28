import prisma from "@/lib";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 422 });
    }

    // Find the OTP record for the given email
    const otpRecord = await prisma.oTP.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "OTP not found. Please request a new OTP." }, { status: 404 });
    }

    // Check if the OTP is correct and has not expired
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new OTP." }, { status: 401 });
    }

    // Find the user associated with the email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create the response with the token and user info
    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        },
        message: "Login successful!",
      },
      { status: 200 }
    );

    // Set the token as an HttpOnly cookie
    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800;`
    );

    // Optionally delete the OTP record after successful login
    // await prisma.oTP.delete({
    //   where: { email },
    // });

    return response;
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
