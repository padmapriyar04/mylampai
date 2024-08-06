import prisma from "../../lib/index";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
};
