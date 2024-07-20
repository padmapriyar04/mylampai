// api to create a lesson within a chapter
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type LessonRequest = {
    Lesson_Name: string;
    lab?: string;
    content_url: string;
    video_url: string;
    Assesment_url: string;
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

export const POST = async (req: NextRequest, { params }: { params: { moduleId: string; chapterId: string } }) => {
    const { moduleId, chapterId } = params;

    try {
        const { userId, status, error } = await verifyTokenAndAdmin(req);
        if (error) {
            return NextResponse.json({ error }, { status });
        }

        const lesson: LessonRequest = await req.json();
        if (!lesson.Lesson_Name || !lesson.content_url || !lesson.video_url || !lesson.Assesment_url) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 422 });
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
            return NextResponse.json({ error: 'Chapter does not exist' }, { status: 422 });
        }

        // Create the Lesson
        const createdLesson = await prisma.lesson.create({
            data: {
                Lesson_Name: lesson.Lesson_Name,
                lab: lesson.lab,
                content_url: lesson.content_url,
                video_url: lesson.video_url,
                Assesment_url: lesson.Assesment_url,
                chapter: { connect: { id: chapterId } },
            },
        });

        return NextResponse.json({ lesson: createdLesson }, { status: 201 });
    } catch (error) {
        console.error('Error creating lesson:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

export const GET = async (req: NextRequest, { params }: { params: { moduleId: string; chapterId: string } }) => {
    return NextResponse.json({ message: "This route only supports POST requests." }, { status: 405 });
};
