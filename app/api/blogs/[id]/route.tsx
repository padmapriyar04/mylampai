import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export const GET = async (req: NextRequest, res: NextResponse) => {

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: "Authorization header missing or malformed" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const id = req.url.split("/blogs/")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }
    const post = await prisma.blog.findUnique({
      where: { id },
      include: {
        sections: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};

