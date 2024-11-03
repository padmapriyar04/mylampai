import { NextResponse } from "next/server";
import prisma from "@/lib";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  try {
    const {
      email,
      name,
      first_name,
      last_name,
      phone,
      password,
      role = "user",
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
    } = await req.json();

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

    const otpRecord = await prisma.oTP.findUnique({ where: { email } });

    if (!otpRecord || !otpRecord.verified) {
      return NextResponse.json({ error: "OTP not verified." }, { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
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

      await prisma.oTP.delete({ where: { email } });

      const token = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      const response = NextResponse.json(
        {
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            phone: existingUser.phone,
            role: existingUser.role,
          },
          token: token,
        },
        { status: 200 },
      );

      response.headers.append(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=604800;`,
      );

      return response;
    } else {
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
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
