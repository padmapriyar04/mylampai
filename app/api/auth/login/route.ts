import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib"; // Adjust path as per your project setup
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    // Connect to database and find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // If user doesn't exist or password is incorrect
    if (
      !user ||
      !user.hashedPassword ||
      !(await bcrypt.compare(password, user.hashedPassword))
    ) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.first_name + " " + user.last_name,
        role: user.role,
      },
      process.env.JWT_SECRET || "okokokok",
      { expiresIn: "7d" }
    );

    // Set token in cookie
    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.first_name + " " + user.last_name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set the JWT token in an HttpOnly cookie
    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400;`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}