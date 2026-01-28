import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    about,
    address,
    currency,
    country,
    latitude,
    longitude,
  } = await req.json();

  const gymId = session.user.gymId;

  if (!gymId) {
    return NextResponse.json({ error: "Gym ID not found" }, { status: 400 });
  }

  try {
    await prisma.gym.update({
      where: { id: gymId },
      data: {
        about,
        address,
        currency,
        country,
        latitude,
        longitude,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}