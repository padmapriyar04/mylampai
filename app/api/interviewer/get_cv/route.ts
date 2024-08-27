import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib'; // Adjust the path as per your project structure
import jwt from 'jsonwebtoken';

export const GET = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = decodedToken;

    // Fetch the most recently uploaded CV for the authenticated user using findFirst
    const cv = await prisma.cV.findFirst({
      where: { userId },
      orderBy: {
        createdAt: 'desc', // Fetch the most recent CV based on the createdAt field
      },
    });

    if (!cv) {
      return NextResponse.json({ message: 'No CV found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'CV retrieved successfully', cv }, { status: 200 });

  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
