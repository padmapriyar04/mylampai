// pages/api/auth/register.ts

import { NextResponse } from "next/server";
import prisma from "../../../../lib/index";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/app/helpers/server";

export const POST = async (req: Request) => {
  try {
    const {
      email,
      name,
      first_name,
      last_name,
      phone,
      password,
      role = "user", // Default role set to "user"
      secret,
      country,
      college,
      degree,
      branch,
      areaOfStudy,
      expectedGraduationDate,
      goal,
      skills,
      headline,
    } = (await req.json()) as {
      email: string;
      name: string;
      first_name: string;
      last_name: string;
      phone: string;
      password: string;
      role?: string;
      secret?: string;
      country?: string;
      college?: string;
      degree?: string;
      branch?: string;
      areaOfStudy?: string;
      expectedGraduationDate?: string;
      goal?: string;
      skills?: string;
      headline?: string;
    };

    // Basic validation
    if (
      !email ||
      !first_name ||
      !last_name ||
      !name ||
      !phone ||
      !password ||
      (role === "admin" && !secret)
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 422 },
      );
    }

    // Check OTP verification status
    const otpRecord = await prisma.oTP.findUnique({ where: { email } });

    if (!otpRecord || !otpRecord.verified) {
      return NextResponse.json(
        { error: "OTP not verified. Please verify OTP before registration." },
        { status: 422 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Update existing user information
      await prisma.user.update({
        where: { email },
        data: {
          first_name,
          last_name,
          name,
          phone,
          hashedPassword: hashedPassword,
          role,
        },
      });

      // Optionally update userInfo
      let userInfo;
      if (
        country ||
        college ||
        degree ||
        branch ||
        areaOfStudy ||
        expectedGraduationDate ||
        goal ||
        skills ||
        headline
      ) {
        userInfo = await prisma.userInfo.upsert({
          where: { userId: existingUser.id },
          update: {
            country: country || null,
            college: college || null,
            degree: degree || null,
            branch: branch || null,
            areaOfStudy: areaOfStudy || null,
            expectedGraduationDate: expectedGraduationDate || null,
            goal: goal || null,
            skills: skills || null,
            headline: headline || null,
          },
          create: {
            country: country || null,
            college: college || null,
            degree: degree || null,
            branch: branch || null,
            areaOfStudy: areaOfStudy || null,
            expectedGraduationDate: expectedGraduationDate || null,
            goal: goal || null,
            skills: skills || null,
            headline: headline || null,
            user: { connect: { id: existingUser.id } },
          },
        });
      }

      // Delete OTP record
      await prisma.oTP.delete({ where: { email } });

      return NextResponse.json(
        { user: existingUser, userInfo },
        { status: 200 },
      );
    } else {
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          email,
          first_name,
          last_name,
          name,
          phone,
          hashedPassword: hashedPassword,
          role,
        },
      });

      // Optionally create userInfo
      let userInfo;
      if (
        country ||
        college ||
        degree ||
        branch ||
        areaOfStudy ||
        expectedGraduationDate ||
        goal ||
        skills ||
        headline
      ) {
        userInfo = await prisma.userInfo.create({
          data: {
            country: country || null,
            college: college || null,
            degree: degree || null,
            branch: branch || null,
            areaOfStudy: areaOfStudy || null,
            expectedGraduationDate: expectedGraduationDate || null,
            goal: goal || null,
            skills: skills || null,
            headline: headline || null,
            user: { connect: { id: newUser.id } },
          },
        });
      }

      // Delete OTP record
      await prisma.oTP.delete({ where: { email } });

      return NextResponse.json(
        {
          token: "",
          user: {
            id: newUser.id,
            email,
            name,
            role,
          },
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
