"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export const getUserIdServer = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET as string)

    const userId = decodedToken.userId as string;

  } catch (error) {
    redirect("/login");
  }

  console.log(token.value)
}