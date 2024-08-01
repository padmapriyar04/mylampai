import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib";

// GET all posts
export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.blog.findMany();
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
function myfunction(item: any) {
  console.log(item);
}
// POST a new post
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const formDataObj: any = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    console.log(formDataObj);
    const { title, description, authorName, position, sections, image } =
      formDataObj;
    const sectionsData = JSON.parse(sections).map((section: any) => ({
      subheading: section.subheading,
      content: section.content,
    }));
    const post = await prisma.blog.create({
      data: {
        title,
        description,
        authorName,
        position,
        sections: {
          create: sectionsData,
        },
        image,
      },
    });

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
