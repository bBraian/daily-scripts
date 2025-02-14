import { NextRequest, NextResponse } from "next/server";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!; // Store in .env

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      ); 
    }

    const emailAlreadyTaken = await prisma.user.findUnique({ where: { email } });
    if (emailAlreadyTaken) {
      return NextResponse.json(
        { message: "Email já utilizado" },
        { status: 401 }
      ); 
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });

    // Create JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json(
      { message: "Conta criada com sucesso", token },
      { status: 200 },
    );

  } catch (error) {
    console.error("Error updating script:", error);
    return NextResponse.json({ error: "Internal server error"}, { status: 500 });
  }
}
