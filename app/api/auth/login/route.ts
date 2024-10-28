import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (
      !user ||
      !user.hashedPassword ||
      !(await bcrypt.compare(password, user.hashedPassword))
    ) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.first_name + " " + user.last_name,
        role: "user",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // Set token in cookie
    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    );

    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800;`,
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
