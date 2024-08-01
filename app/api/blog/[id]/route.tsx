import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib";

export const GET = async (request: NextRequest) => {
  try {
    const id = request.url.split("/blog/")[1];
    const post = await prisma.blog.findFirst({ where: { id } });
    if (!post)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const id = request.url.split("/blog/")[1];
    const formData = await request.formData();
    const formDataObj: any = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    console.log(formDataObj);
    const { title, description, authorName, position, sections, image } =
      formDataObj;
    console.log(id);
    const post = await prisma.blog.update({
      where: { id },
      data: {
        title,
        description,
        authorName,
        position,
        image,
        sections: {
          create: JSON.parse(sections).map((section: any) => ({
            subheading: section.subheading,
            content: section.content,
          })),
        },
      },
      include: {
        sections: true,
      },
    });
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const id = request.url.split("/blog/")[1];
    const post = await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
