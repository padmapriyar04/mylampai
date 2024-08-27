import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    })
  ],

  // callbacks: {
      // async signIn({ account, profile }) {
        // if (account?.provider === "google" && profile?.email) {
        //   // Check if email exists
        //   const existingUser = await prisma.user.findUnique({
        //     where: { email: profile.email },
        //   });

        //   if (existingUser) {
        //     console.log("User already exists:", existingUser);
        //   } else {
        //     // User does not exist, create a new user with the profile data
        //     const newUser = await prisma.user.create({
        //       data: {
        //         name: profile.name || "",
        //         email: profile.email,
        //         role:"user",
        //       },
        //     });
        //     console.log("User created:", newUser);
        //   }
        // }

      //   return true;
      // },
  // },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
