// app/api/modules/[moduleId]/chapters/[chapterId]/lessons/[lessonId]/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";
import jwt from "jsonwebtoken";

type LessonRequest = {
  Lesson_Name: string;
  lab?: string;
  content_url: string;
  video_url: string;
  Assesment_url: string;
};

// Middleware to verify the JWT token and user role
const verifyTokenAndAdmin = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.error("JWT verification error:", error);
    return { error: "Unauthorized", status: 401 };
  }

  const { id: userId, role } = decodedToken;

  if (role !== "admin") {
    return { error: "Unauthorized", status: 403 };
  }

  return { userId, status: 200 };
};

export const PATCH = async (
  req: NextRequest,
  {
    params,
  }: { params: { moduleId: string; chapterId: string; lessonId: string } }
) => {
  const { moduleId, chapterId, lessonId } = params;

  console.log(`moduleId: ${moduleId}`);
  console.log(`chapterId: ${chapterId}`);
  console.log(`lessonId: ${lessonId}`);

  try {
    const { userId, status, error } = await verifyTokenAndAdmin(req);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Validate lessonId
    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const data: LessonRequest = await req.json();
    if (
      !data.Lesson_Name ||
      !data.content_url ||
      !data.video_url ||
      !data.Assesment_url
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 422 }
      );
    }

    // Check if the module exists
    const existingModule = await prisma.modules.findUnique({
      where: { id: moduleId },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: "Module does not exist" },
        { status: 404 }
      );
    }

    // Check if the chapter exists
    const existingChapter = await prisma.chapters.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return NextResponse.json(
        { error: "Chapter does not exist" },
        { status: 404 }
      );
    }

    // Check if the lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson does not exist" },
        { status: 404 }
      );
    }

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        Lesson_Name: data.Lesson_Name,
        lab: data.lab?.toString(),
        content_url: data.content_url,
        video_url: data.video_url,
        Assesment_url: data.Assesment_url,
      },
    });

    return NextResponse.json({ lesson: updatedLesson }, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
