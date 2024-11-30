// API route for chapter update within a module
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib';
import jwt from 'jsonwebtoken';

type ChapterRequest = {
    Chapter_Name: string;
    Lessons: string;
};

// Middleware to verify the JWT token and user role
const verifyTokenAndAdmin = async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Unauthorized', status: 401 };
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
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

export const DELETE = async (req: NextRequest, { params }: { params: { moduleId: string, chapterId: string } }) => {
    const { moduleId, chapterId } = params;

    try {
        const { userId, status, error } = await verifyTokenAndAdmin(req);
        if (error) {
            return NextResponse.json({ error }, { status });
        }
        // Check if the module exists
        const existingModule = await prisma.modules.findUnique({
            where: { id: moduleId },
        });

        if (!existingModule) {
            return NextResponse.json({ error: 'Module does not exist' }, { status: 404 });
        }

        // Check if the chapter already exists
        const existingChapter = await prisma.chapters.findUnique({
            where: { id: chapterId },
        });

        if (!existingChapter) {
            return NextResponse.json({ error: 'Chapter does not exist' }, { status: 404 });
        }

        // Deleting chapter
        await prisma.chapters.delete({
            where: { id: chapterId },
        });


        return NextResponse.json({ message: "chapter deleted" }, { status: 201 });
    } catch (error) {
        console.error('Error creating chapter:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};