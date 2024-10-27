import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib";

export const GET = async (req: NextRequest) => {
  try {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json({ message: "Success", blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const formDataObj: any = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    
    console.log("formDataObj ", formDataObj);

    const { title, description, authorName, position, sections, image } =
      formDataObj;

    const sectionsData = JSON.parse(sections).map((section: any) => ({
      subheading: section.subheading,
      content: section.content,
    }));
    
    await prisma.blog.create({
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


    return NextResponse.json({ message: "New blog created" }, { status: 201 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
