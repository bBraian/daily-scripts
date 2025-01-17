import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const script = await prisma.script.findMany({
            include: { scriptTypes: true }
        });

        if (!script) {
            return NextResponse.json({ error: "Script not found", status: 404});
        }

        return NextResponse.json(script);
    } catch (error) {
        console.error("Error fetching script:", error);
        return NextResponse.json({ error: "Internal server error", status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, scriptTypeId, expectedReturnId, sqlQuery } = await req.json();

        if (!name || !scriptTypeId || !expectedReturnId || !sqlQuery) {
            return NextResponse.json({ error: "Campos obrigatórios não preenchidos", status: 400 });
        }

        const script = await prisma.script.create({
            data: {
                name,
                scriptTypeId: parseInt(scriptTypeId),
                expectedReturnId: parseInt(expectedReturnId),
                sqlQuery,
                createdTime: new Date(),
                updatedTime: new Date()
            },
        });

        return NextResponse.json(script, { status: 200 });
    } catch (error) {
        console.error("Error updating script:", error);
        return NextResponse.json({ error: "Internal server error", status: 500});
    }
}