// app/api/community/[communityId]/interact.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib';
import jwt from 'jsonwebtoken';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const POST = async (req: NextRequest, { params }: { params: { communityId: string } }) => {
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
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user ID from decoded token
    const { id: userId, email: userEmail, name: userName, role: userRole } = decodedToken;

    const community = await prisma.community.findUnique({
      where: { id: params.communityId },
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    if (!community.userIds.includes(userId)) {
      return NextResponse.json({ error: 'User has not joined the community' }, { status: 400 });
    }

    const chatToken = jwt.sign(
      {
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole,
        community: community
      },
      process.env.JWT_SECRET || 'okokokok',
      { expiresIn: '24h' }
    );


    return NextResponse.json({ chatToken: chatToken }, { status: 200 });
  } catch (error) {
    console.error('Error sending message to community:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
