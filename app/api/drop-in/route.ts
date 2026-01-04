import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fee } = await req.json();

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
    select: { id: true, slug: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  try {

    await prisma.dropIn.upsert({
      where: { gymId: gym.id },
      update: {
        fee: Number(fee),
      },
      create: {
        fee: Number(fee),
        gymId: gym.id,
        qrCode: `https://${gym.slug}.bjjdesk.com/drop-in`,
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