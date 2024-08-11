import prisma from "@/lib/index";


export const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw new Error("Unable to connect to the database. Please check your connection settings.");
    }
};