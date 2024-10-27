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
