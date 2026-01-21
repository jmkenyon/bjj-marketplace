import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content || typeof content !== "string" || content.trim().length < 20) {
    return NextResponse.json(
      { error: "Waiver content is required" },
      { status: 400 }
    );
  }

  const gymId = session.user.gymId;

  if (!gymId) {
    return NextResponse.json(
      { error: "Gym not found for admin" },
      { status: 400 }
    );
  }

  try {
    await prisma.waiver.upsert({
      where: { gymId },
      update: {
        content,
      },
      create: {
        content,
        gymId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
