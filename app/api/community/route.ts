import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import prisma from "@/lib";

export const GET = async (req: NextRequest) => {
  try {
    const communities = await prisma.community.findMany();
    return NextResponse.json({ communities });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};


type CommunityRequest = {
  name: string;
  description?: string;
  comm_type: 'Exclusive' | 'Normal';
};

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7); 
    
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'okokokok');
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: creatorId, role } = decodedToken;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, description,comm_type }: CommunityRequest = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 422 });
    }

    const existingCommunity = await prisma.community.findUnique({
      where: { name },
    });

    if (existingCommunity) {
      return NextResponse.json({ error: 'Community already exists' }, { status: 422 });
    }

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
  } 
};