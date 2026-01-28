import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, password } = await req.json();

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

  await prisma.user.update({
    where: { id: reset.userId },
    data: { hashedPassword },
  });

  await prisma.passwordToken.delete({
    where: { id: reset.id },
  });

  return NextResponse.json({ success: true });
}