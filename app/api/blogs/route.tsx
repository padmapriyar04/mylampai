import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const GET = async (request: NextRequest, res: NextResponse) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: "Authorization header missing or malformed" }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };

    // Check if the user has admin privileges
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const posts = await prisma.blog.findMany({
      include: {
        sections: true,
      },
    });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: "Authorization header missing or malformed" }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const { title, description, authorName, position, readtime, sections, tags } = await req.json();
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };

    // Check if the user has admin privileges
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }
    const post = await prisma.blog.create({
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
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
