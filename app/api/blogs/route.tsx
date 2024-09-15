import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib";

export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.blog.findMany({
      include: {
        sections: true,
      },
    });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const {
      title,
      description,
      authorName,
      position,
      readtime,
      sections,
      tags,
    } = await req.json();

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { role: string };

    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Insufficient privileges" },
        { status: 403 }
      );
    }

    await prisma.blog.create({
      data: {
        title,
        description,
        authorName,
        position,
        readtime,
        tags,
        sections: {
          create: sections.map((section: any) => ({
            subheading: section.subheading,
            content: section.content,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Blog created successfully", isCreated: true }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};