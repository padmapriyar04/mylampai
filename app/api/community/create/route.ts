import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type CommunityRequest = {
  name: string;
  description?: string;
  comm_type: 'exclusive' | 'normal';
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
    const { id: creatorId, role } = decodedToken;

    // Check if the user is authorized (only admins can create communities)
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, description,comm_type }: CommunityRequest = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 422 });
    }

    await connectToDatabase();
    const existingCommunity = await prisma.community.findUnique({
      where: { name },
    });

    if (existingCommunity) {
      return NextResponse.json({ error: 'Community already exists' }, { status: 422 });
    }

    // Create the community
    const createdCommunity = await prisma.community.create({
      data: {
        name,
        description,
        comm_type,
      },
    });

    return NextResponse.json({ community: createdCommunity }, { status: 201 });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};