import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { slugifyGymName } from "@/app/lib/slugify";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, gymName } = body;

  if (!email || !password || !gymName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const gymSlug = slugifyGymName(gymName);

  // Check gym slug
  const existingGym = await prisma.gym.findUnique({
    where: { slug: gymSlug },
  });

  if (existingGym) {
    return NextResponse.json(
      { error: "Gym URL already taken" },
      { status: 409 }
    );
  }

  // Check email
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

  // Create gym + owner
  await prisma.gym.create({
    data: {
      name: gymName,
      slug: gymSlug,
      users: {
        create: {
          email,
          hashedPassword,
          role: "ADMIN",
        },
      },
    },
  });

  return NextResponse.json(
    { success: true, gymSlug },
    { status: 201 }
  );
}