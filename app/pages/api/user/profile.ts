import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // In a real application, you'd get the user ID from the session
    // For now, we'll use a hardcoded ID from your example
    const userId = "6697cd5aec1076cab1556086";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
