import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const script = await prisma.script.findMany();

        if (!script) {
            return NextResponse.json({ error: "Script not found", status: 404});
        }

        return NextResponse.json(script);
    } catch (error) {
        console.error("Error fetching script:", error);
        return NextResponse.json({ error: "Internal server error", status: 500});
    }
}