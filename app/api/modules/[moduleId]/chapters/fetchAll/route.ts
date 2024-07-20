
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/index';

export const GET = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  const { moduleId } = params;

  try {
    // Connect to the database
    await prisma.$connect();

    // Fetch all chapters for the specified module ID
    const chapters = await prisma.chapters.findMany({
      where: {
        chapterId : moduleId,
      },
      orderBy: {
        id: 'asc', // Order by id or any other criteria as needed
      },
    });

    // Return the fetched chapters as JSON response
    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    // Handle errors and return an error response
    console.error('Error fetching chapters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};
