import prisma from "../../prisma/index";


export const connectToDatabase = async () =>{
    try {
        await prisma.$connect();
    } catch (error) {
        throw new Error("Unable to connect to database")
    }
}