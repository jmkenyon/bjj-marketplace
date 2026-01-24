import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const passwordToken = await prisma.passwordToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!passwordToken) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 400 }
    );
  }

  if (passwordToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This link has expired" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: passwordToken.userId },
      data: { hashedPassword },
    }),
    prisma.passwordToken.delete({
      where: { id: passwordToken.id },
    }),
  ]);

  return NextResponse.json({ success: true });
}