import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN" || !session.user.gymId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
    select: { stripeAccountId: true },
  });

  if (!gym?.stripeAccountId) {
    return NextResponse.json({ connected: false });
  }

  const account = await stripe.accounts.retrieve(gym.stripeAccountId);

  const isEnabled =
    account.charges_enabled === true &&
    account.payouts_enabled === true;

  if (isEnabled) {
    await prisma.gym.update({
      where: { id: session.user.gymId },
      data: { stripeEnabled: true },
    });
  }

  return NextResponse.json({
    connected: isEnabled,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
  });
}