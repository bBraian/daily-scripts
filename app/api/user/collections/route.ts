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

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET) as { userId: number , email: string, iat: number };

    const userCollections = await prisma.collection.findMany({
      where: { id: decoded.userId },
      orderBy: { id: "asc" }
    });

    if (!userCollections) {
      return NextResponse.json({ error: "Any collections not found", status: 404 });
    }

    return NextResponse.json(userCollections);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
