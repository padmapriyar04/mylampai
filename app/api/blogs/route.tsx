import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, res: NextResponse) => {
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

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { title, description, authorName, position, sections, tags } = await req.json();
  try {
    const post = await prisma.blog.create({
      data: {
        title,
        description,
        authorName,
        position,
        tags,
        sections: {
          create: sections.map((section: any) => ({
            subheading: section.subheading,
            content: section.content,
          })),
        },
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    console.error('Error creating blog post:', err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } 
};
