"use server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function auth() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken || !accessToken.value) return null;

  try {
    const decoded = jwt.verify(
      accessToken?.value as string,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
