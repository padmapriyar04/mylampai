import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib';

export const GET = async (req: NextRequest, { params }: { params: { moduleId: string, chapterId: string } }) => {
    const { moduleId, chapterId } = params;

    try {

        // Fetch all lessons for the chapter
        const lessons = await prisma.lesson.findMany({
            where: {
                chapterId: chapterId,
            },
            orderBy: {
                id: 'asc', // Order by id or any other criteria as needed
            },
        });

        return NextResponse.json({ lessons }, { status: 200 });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
