import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expectedReturn = await prisma.expectedScriptReturn.findMany();

    if (!expectedReturn) {
      return NextResponse.json({
        error: "expectedReturn not found",
        status: 404,
      });
    }

    return NextResponse.json(expectedReturn);
  } catch (error) {
    console.error("Error fetching script:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
