import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }
    
    const isValidEmail = validateEmail(email);
    
    if (!isValidEmail) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 400 },
      );
    }

    const newsletter = await prisma.newsletterEmails.findFirst({
      where: { email },
    });

    if (newsletter) {
      return NextResponse.json({ messge: "Subscribed!" }, { status: 200 });
    }
    
    await prisma.newsletterEmails.create({
      data: {
        email,
      },
    });
    
    return NextResponse.json({ message: "Subscribed!" }, { status: 200 });
    
  } catch (err) {
    console.log("error", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
