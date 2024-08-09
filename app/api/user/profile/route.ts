import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib";
import { decodeToken } from "@/utils/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = decodedToken.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib"; // Adjust this import path as needed
// import { verifyTokenAndUser } from "@/app/helpers/auth"; // Create this helper function

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, error, status } = await verifyTokenAndUser(req);
//     if (error) {
//       return NextResponse.json({ error }, { status });
//     }

//     const profileData = await req.json();

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         userInfo: {
//           upsert: {
//             create: profileData,
//             update: profileData,
//           },
//         },
//       },
//       include: {
//         userInfo: true,
//       },
//     });

//     return NextResponse.json({ user: updatedUser }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
