import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction([
      // Delete access passes
      prisma.accessPass.deleteMany({
        where: { userId },
      }),

      // Delete signed waivers
      prisma.signedWaiver.deleteMany({
        where: { userId },
      }),

      // Delete password reset tokens
      prisma.passwordToken.deleteMany({
        where: { userId },
      }),

      prisma.payment.deleteMany({
        where: { userId },
      }),

      // Finally delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}