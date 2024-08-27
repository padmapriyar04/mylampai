import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const body = await req.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({
        "error": "Name is Required"
      }, {status: 400})
    }
    
    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: name
      },
    });

    return NextResponse.json({user });
  } catch(error ) {
    console.log(error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}


export async function DELETE(req: NextRequest, {params}: {params: {userId: string}}) {
  try {
    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json({ message: "User Deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}