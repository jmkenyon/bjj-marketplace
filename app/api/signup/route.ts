import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { slugifyGymName } from "@/app/lib/slugify";

export async function POST(req: Request) {
  const { email, password, gymName } = await req.json();

  if (!email || !password || !gymName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const finalSlug = slugifyGymName(gymName);

  const existingGym = await prisma.gym.findUnique({
    where: { slug: finalSlug },
  });

  if (existingGym) {
    return NextResponse.json(
      { error: "Gym URL already taken" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.gym.create({
    data: {
      name: gymName,
      slug: finalSlug,
      users: {
        create: {
          email,
          hashedPassword,
          role: "ADMIN",
        },
      },
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}