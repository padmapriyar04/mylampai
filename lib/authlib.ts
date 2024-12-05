"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function auth() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken || !accessToken.value) return null;

  try {
    const decoded = jwt.verify(accessToken?.value as string, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
}
