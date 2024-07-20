import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type ModuleRequest = {
  Module_Name?: string;
  No_of_Chapters?: string;
  No_of_Lessons?: string;
  No_of_Weeks?: string;
  No_of_Credits?: string;
  Projects?: string;
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

  const { id: authorId, role } = decodedToken;

  if (role !== 'admin') {
    return { error: 'Unauthorized', status: 403 };
  }

  return { authorId, status: 200 };
};

export const PATCH = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  const { moduleId } = params;

  try {
    const { authorId, status, error } = await verifyTokenAndAdmin(req);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const data: ModuleRequest = await req.json();

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 422 });
    }

    await connectToDatabase();

    // Check for unique constraint violation before updating
    if (data.Module_Name) {
      const moduleWithSameName = await prisma.modules.findUnique({
        where: { Module_Name: data.Module_Name },
      });

      if (moduleWithSameName && moduleWithSameName.id !== moduleId) {
        return NextResponse.json({ error: 'Module name already exists' }, { status: 409 });
      }
    }

    // Update the module in the database
    const updatedModule = await prisma.modules.update({
      where: { id: moduleId },
      data: {
        ...data,
        No_of_Chapters: data.No_of_Chapters?.toString(),
        No_of_Lessons: data.No_of_Lessons?.toString(),
        No_of_Weeks: data.No_of_Weeks?.toString(),
        No_of_Credits: data.No_of_Credits?.toString(),
        Projects: data.Projects,
      },
    });

    return NextResponse.json({ module: updatedModule }, { status: 200 });
  } catch (error) {
    console.error('Error updating module:', error);

    if (isPrismaError(error) && error.code === 'P2002' && error.meta?.target === 'Modules_Module_Name_key') {
      return NextResponse.json({ error: 'Module name already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// Type guard to check if the error is a Prisma error
function isPrismaError(error: unknown): error is { code: string; meta?: { target: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: string }).code === 'string'
  );
}
