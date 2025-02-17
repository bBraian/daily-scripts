import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, SECRET) as { userId: number , email: string, iat: number };

    // Fetch user from DB
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
