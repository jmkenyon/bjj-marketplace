import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN" || !session.user.gymId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.gym.update({
      where: { id: session.user.gymId },
      data: {
        stripeAccountId: null,
        stripeEnabled: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to disconnect Stripe" },
      { status: 500 }
    );
  }
}
