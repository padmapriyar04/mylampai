import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type ChapterRequest = {
  Chapter_Name: string;
  Lessons: number;
};

// Middleware to verify the JWT token and user role
const verifyTokenAndAdmin = async (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'okokokok');
  } catch (error) {
    console.error('JWT verification error:', error);
    return { error: 'Unauthorized', status: 401 };
  }

  const { id: userId, role } = decodedToken;

  if (role !== 'admin') {
    return { error: 'Unauthorized', status: 403 };
  }

  return { userId, status: 200 };
};

export const POST = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  const { moduleId } = params;

  try {
    const { userId, status, error } = await verifyTokenAndAdmin(req);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const chapter: ChapterRequest = await req.json();
    if (!chapter.Chapter_Name || !chapter.Lessons) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 422 }
      );
    }

    await connectToDatabase();

    // Check if the module exists
    const existingModule = await prisma.modules.findUnique({
      where: { id: moduleId },
    });

    if (!existingModule) {
      return NextResponse.json({ error: 'Module does not exist' }, { status: 404 });
    }

    // Check if the chapter already exists within the same module
    const existingChapter = await prisma.chapters.findFirst({
      where: { Chapter_Name: chapter.Chapter_Name, chapterId: moduleId },
    });

    if (existingChapter) {
      return NextResponse.json({ error: 'Chapter already exists' }, { status: 422 });
    }

    // Create the chapter
    const createdChapter = await prisma.chapters.create({
      data: {
        Chapter_Name: chapter.Chapter_Name,
        Lessons: chapter.Lessons.toString(),
        chapter: { connect: { id: moduleId } },
      },
    });

    return NextResponse.json({ chapter: createdChapter }, { status: 201 });
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
