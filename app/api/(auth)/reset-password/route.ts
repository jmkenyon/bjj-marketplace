import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and password are required" },
      { status: 400 }
    );
  }

  const reset = await prisma.passwordToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { hashedPassword },
    }),
    prisma.passwordToken.delete({
      where: { id: reset.id },
    }),
  ]);

  return NextResponse.json({ success: true });
}
