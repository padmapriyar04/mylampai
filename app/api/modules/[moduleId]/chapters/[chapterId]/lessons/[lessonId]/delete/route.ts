// app/api/modules/[moduleId]/chapters/[chapterId]/lessons/[lessonId]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
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

    const { id: userId, role } = decodedToken;

    if (role !== 'admin') {
        return { error: 'Unauthorized', status: 403 };
    }

    return { userId, status: 200 };
};

export const DELETE = async (req: NextRequest, { params }: { params: { moduleId: string, chapterId: string, lessonId: string } }) => {
    const { moduleId, chapterId, lessonId } = params;

    try {
        const { userId, status, error } = await verifyTokenAndAdmin(req);
        if (error) {
            return NextResponse.json({ error }, { status });
        }

        await connectToDatabase();

        // Check if the module exists
        const existingModule = await prisma.modules.findUnique({
            where: { id: moduleId },
        });

        if (!existingModule) {
            return NextResponse.json({ error: 'Module does not exist' }, { status: 404 });
        }

        // Check if the chapter exists
        const existingChapter = await prisma.chapters.findUnique({
            where: { id: chapterId },
        });

        if (!existingChapter) {
            return NextResponse.json({ error: 'Chapter does not exist' }, { status: 404 });
        }

        // Check if the lesson exists
        const existingLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });

        if (!existingLesson) {
            return NextResponse.json({ error: 'Lesson does not exist' }, { status: 404 });
        }

        // Delete the Lesson
        await prisma.lesson.delete({
            where: { id: lessonId },
        });

        return NextResponse.json({ message: 'Lesson has been deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
