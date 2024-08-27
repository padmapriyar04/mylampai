import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";

export const GET = async (req: NextRequest) => {
  try {
    const modules = await prisma.modules.findMany({
      include: {
        author: true,
        chapters: true,
      },
    });

    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
