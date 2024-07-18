import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/index';
import { connectToDatabase } from '@/app/helpers/server';
import jwt from 'jsonwebtoken';

type UpdateProfileRequest = {
    country?: string;
    college?: string;
    degree?: string;
    branch?: string;
    areaOfStudy?: string;
    expectedGraduationDate?: string;
    goal?: string;
    skills?: string;
    headline?: string;
};

// Middleware to verify the JWT token and user role
const verifyTokenAndUser = async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Unauthorized', status: 401 };
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || 'okokokok');
        const { id: userId, role } = decodedToken;

        if (role === 'admin') {
            return { error: 'Only for users', status: 403 };
        }

        return { userId, status: 200 };
    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized', status: 401 };
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const { userId, status, error } = await verifyTokenAndUser(req);
        if (error) {
            return NextResponse.json({ error }, { status });
        }

        const profile: UpdateProfileRequest = await req.json();
        
        await connectToDatabase(); 

        // Check if the user profile already exists
        const existingProfile = await prisma.userInfo.findUnique({
            where: { userId: userId },
        });

        if (existingProfile) {
            const updatedProfile = await prisma.userInfo.update({
                where: { userId: userId },
                data: profile,
            });
            return NextResponse.json({ profile: updatedProfile }, { status: 200 });
        }

        const createdProfile = await prisma.userInfo.create({
            data: {
                ...profile,
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json({ profile: createdProfile }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error in POST handler:', error);

        // Log detailed error if it's an instance of Error
        if (error instanceof Error) {
            console.error('Detailed Error:', {
                message: error.message,
                stack: error.stack,
            });
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
