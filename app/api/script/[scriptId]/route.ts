import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { scriptId: string } }) {
    const { scriptId } = params;

    // Parse scriptId as an integer
    const id = parseInt(scriptId, 10);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid scriptId", status: 400 });
    }

    try {
        const script = await prisma.script.findUnique({
            where: { id },
        });

        if (!script) {
            return NextResponse.json({ error: "Script not found", status: 404});
        }

        const formattedScript = Object.fromEntries(
            Object.entries(script).map(([key, value]) => [
                key,
                typeof value === "number" ? value.toString() : value,
            ])
        );

        return NextResponse.json(formattedScript);
    } catch (error) {
        console.error("Error fetching script:", error);
        return NextResponse.json({ error: "Internal server error", status: 500});
    }
}

export async function PUT(req: NextRequest, { params }: { params: { scriptId: string } }) {
    const { scriptId } = params;
    const id = parseInt(scriptId, 10);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid scriptId", status: 400 });
    }

    try {
        const { name, scriptTypeId, expectedReturnId, sqlQuery } = await req.json();

        if (!name || !scriptTypeId || !expectedReturnId || !sqlQuery) {
            return NextResponse.json({ error: "Campos obrigatórios não preenchidos", status: 400 });
        }

        const script = await prisma.script.update({
            where: { id },
            data: {
                name,
                scriptTypeId: parseInt(scriptTypeId),
                expectedReturnId: parseInt(expectedReturnId),
                sqlQuery,
            },
        });

        return NextResponse.json(script, { status: 200 });
    } catch (error) {
        console.error("Error updating script:", error);
        return NextResponse.json({ error: "Internal server error", status: 500});
    }
}