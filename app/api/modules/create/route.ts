import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type ModuleRequest = {
  Module_Name: string;
  No_of_Chapters: number;
  No_of_Lessons: number;
  No_of_Weeks: number;
  No_of_Credits: number;
  Projects: string;
};

export const POST = async (req: NextRequest) => {
  try {
    // Extract authorization token from request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify and decode the JWT token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'okokokok');
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract admin ID and role from decoded token
    const { id: authorId, role } = decodedToken;

    // Check if the user is authorized (only admins can create modules)
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Request body
    const {
      Module_Name,
      No_of_Chapters,
      No_of_Lessons,
      No_of_Weeks,
      No_of_Credits,
      Projects,
    }: ModuleRequest = await req.json();

    // Validate required fields
    if (
      !Module_Name ||
      !No_of_Chapters ||
      !No_of_Lessons ||
      !No_of_Weeks ||
      !No_of_Credits ||
      !Projects
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 422 }
      );
    }

    await connectToDatabase();

    // Check if the module already exists
    const existingModule = await prisma.modules.findUnique({
      where: { Module_Name },
    });

    if (existingModule) {
      return NextResponse.json({ error: 'Module already exists' }, { status: 422 });
    }

    // Create the module
    const createdModule = await prisma.modules.create({
      data: {
        Module_Name,
        No_of_Chapters: No_of_Chapters.toString(),
        No_of_Lessons: No_of_Lessons.toString(),
        No_of_Weeks: No_of_Weeks.toString(),
        No_of_Credits: No_of_Credits.toString(),
        Projects,
        author: { connect: { id: authorId } },
      },
    });

    return NextResponse.json({ module: createdModule }, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};
