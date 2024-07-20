// app/api/dm/[dmId]
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma'; 
import jwt from 'jsonwebtoken';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); 

export const POST = async (req: NextRequest, { params }: { params: { dmId: string } }) => {
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
   
    const user = await prisma.user.findUnique({
      where: { id: params.dmId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    const chatToken= jwt.sign(
      {
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole,
        dmId: user
     
      },
      process.env.JWT_SECRET || 'okokokok',
      { expiresIn: '24h' }
    );


    return NextResponse.json({chatToken: chatToken}, { status: 200 });
  } catch (error) {
    console.error('Error sending message to community:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};
