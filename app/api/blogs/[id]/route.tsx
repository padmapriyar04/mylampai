
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export const GET = async (req: NextRequest, res: NextResponse) => {
  const id = req.url.split("/blog/")[1];
  try {
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
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } 
};

