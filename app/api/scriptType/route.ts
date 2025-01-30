import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scriptType = await prisma.scriptType.findMany();

    if (!scriptType) {
      return NextResponse.json({ error: "scriptType not found", status: 404 });
    }

    return NextResponse.json(scriptType);
  } catch (error) {
    console.error("Error fetching script:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
