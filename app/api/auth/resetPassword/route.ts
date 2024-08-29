import prisma from "@/lib";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 422 });
    }

    // Verify the token and extract the user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET as string) as { id: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      await prisma.$disconnect(); // Disconnect before returning
      return NextResponse.json({ error: "Account does not exist." }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedPassword },
    });

    // Return success response
    return NextResponse.json({ email: user.email, message: "Password has been reset successfully." }, { status: 200 });
  } catch (error) {
    // Disconnect from the database in case of error
    // await prisma.$disconnect();
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
