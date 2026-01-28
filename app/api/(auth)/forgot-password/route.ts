import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";


export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ success: true });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // 🔒 Do NOT reveal if user exists
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.passwordToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  await sendPasswordResetEmail({
    to: user.email,
    token,
  });

  return NextResponse.json({ success: true });
}