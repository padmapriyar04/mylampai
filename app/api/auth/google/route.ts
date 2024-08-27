import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/index';
import { connectToDatabase } from '@/app/helpers/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name} = await req.json() as {
      email: string;
      name: string;
    };

    // Basic validation
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email, name, are required." },
        { status: 422 }
      );
    }

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Update existing user information
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          email,
        },
      });

      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } else {
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      return NextResponse.json({ user: newUser }, { status: 201 });
    }
  } catch (error) {
    console.error('Error during Google user registration:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
