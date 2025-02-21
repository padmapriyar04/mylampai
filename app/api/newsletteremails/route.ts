import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";
import { sendEmail } from "@/lib/nodemailer";
import { generateFinalEmailTemplate } from "@/utils/templatefunction";

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// export const POST = async (req: NextRequest) => {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required" },
//         { status: 400 },
//       );
//     }

//     const isValidEmail = validateEmail(email);

//     if (!isValidEmail) {
//       return NextResponse.json(
//         { message: "Invalid email" },
//         { status: 400 },
//       );
//     }

//     const newsletter = await prisma.newsletterEmails.findFirst({
//       where: { email },
//     });

//     if (newsletter) {
//       return NextResponse.json({ messge: "Subscribed!" }, { status: 200 });
//     }

//     await prisma.newsletterEmails.create({
//       data: {
//         email,
//       },
//     });

//     return NextResponse.json({ message: "Subscribed!" }, { status: 200 });

//   } catch (err) {
//     console.log("error", err);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// };




export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { emails, subject, content,template } = body;

    if (!emails || !subject || !content || !template) {
      return NextResponse.json(
        { error: "Emails, subject, content and template are required" },
        { status: 400 }
      );
    }

    // const EmailsMailString = emails.join(", ");

    try {
      const newNewsletter = await prisma.newsletter.create({
        data: {
          subject,
          content,
          template,
          sentTimestamp: new Date(),
          openCount: 0,
        },
      });
      for(let i=0;i<emails.length;i++){
        let email = emails[i];
        const curtemplate = generateFinalEmailTemplate(template,email,newNewsletter.id);
        const res = await sendEmail(email, subject, curtemplate);
        if(res !== "success"){
          const deletedNewsletter = await prisma.newsletter.delete({
            where : {
              id : newNewsletter.id
            }
          })
          return NextResponse.json(
            { error: "Failed to send Emails" },
            { status: 500 }
          );
        }
      }

      const createdEmails = await Promise.all(
        emails.map((email: any) =>
          prisma.email.create({
            data: {
              emailAddress: email,
              status: 'Delivered',
              newsletterId: newNewsletter.id,
            },
          })
        )
      );

      const updatedNewsletter = await prisma.newsletter.update({
        where: { id: newNewsletter.id },
        data: {
          emails: {
            connect: createdEmails.map((email) => ({ id: email.id })),
          },
        },
      });

      return NextResponse.json(
        {
          message: "Emails sent successfully",
          newsletter: updatedNewsletter
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending emails:", error);
      return NextResponse.json(
        { error: "Internal Server Error", errormsg: error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST API:", error);
    return NextResponse.json(
      { error: "Internal Server Error", errormsg:  error },
      { status: 500 }
    );
  }
};
