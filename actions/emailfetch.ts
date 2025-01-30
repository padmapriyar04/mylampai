"use server"

import prisma from "@/lib"

export const fetchEmails = async () => {
    try {
        const emails = await prisma.newsletter.findMany();
        return emails;
    } catch (error) {
        console.error("Error in fetchEmails:", error);
    }
}

export const getNewsletter = async (newsletterId: string) => {
    try {
        const newsletter = await prisma.newsletter.findMany({
            where: {
                id: newsletterId
            }
        });
        return newsletter;
    } catch (error) {
        console.error("Error in fetchEmails:", error);
    }
}

export const getRecipentEmails = async (newsletterId: string) => {
    try {
        const recipient_emails = await prisma.email.findMany({
            where : {
              newsletterId : newsletterId
            },
            select: {
              emailAddress: true,
              status: true,
              openedAt: true,
            }
          });
          return recipient_emails;
    } catch (error) {
        console.error("Error in fetchEmails:", error);
    }
}