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

    // Fetch all CVs for the authenticated user
    const cvs = await prisma.cV.findMany({
      where: { userId },
    });

    if (cvs.length === 0) {
      return NextResponse.json({ message: 'No CVs found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'CVs retrieved successfully', cvs }, { status: 200 });

  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
