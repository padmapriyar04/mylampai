// pages/api/community/getAll.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib';
import { connectToDatabase } from '@/app/helpers/server';

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const communities = await prisma.community.findMany();

    return NextResponse.json({ communities });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};
