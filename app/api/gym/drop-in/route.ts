import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";
import { generateTenantURL } from "@/app/lib/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fee } = await req.json();

  const gymId = session.user.gymId;

  if (!gymId) {
    return NextResponse.json(
      { error: "Gym not found for admin" },
      { status: 400 }
    );
  }

  const gym = await prisma.gym.findUnique({
    where: { id: gymId },
    select: { id: true, slug: true, currency: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  const parsedFee = Number(fee);

  if (Number.isNaN(parsedFee) || parsedFee < 0) {
    return NextResponse.json({ error: "Invalid fee" }, { status: 400 });
  }

  try {
    await prisma.dropIn.upsert({
      where: { gymId: gym.id },
      update: {
        fee: parsedFee,
      },
      create: {
        fee: parsedFee,
        currency: gym.currency,
        gymId: gym.id,
        qrCode: `${generateTenantURL(gym.slug)}/drop-in`,
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
