// API route for module deletion
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';


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

export const DELETE = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  const { moduleId } = params;

  try {
    const { authorId, status, error } = await verifyTokenAndAdmin(req);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    await connectToDatabase();

    await prisma.modules.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({ message: 'Module deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
