import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    { status: 201 }
  );
}