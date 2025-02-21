import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib";
import { EmailStatus } from "@prisma/client";

export const GET = async (req: NextRequest) => {
    const email = req.nextUrl.searchParams.get('email');
    // let opentime = req.nextUrl.searchParams.get('opentime');
    const newsletterId = req.nextUrl.searchParams.get('newsletterId');
    if (!newsletterId) {
      return NextResponse.json({ error: "Email Required" }, { status: 400 });
    }
  
    try {
      const emailobj = await prisma.email.update({
        where: {
          id: (newsletterId)? newsletterId : "NA",
          emailAddress: (email)? email : "NA",
        },
        data: {
          status: EmailStatus.Opened,
          openedAt:  new Date(),
        }
      })
      console.log(`Email has been opened by ${email}`);
    } catch (error) {
      console.log(error);
    }
  
    return NextResponse.json({ status: 200 });
  }
  