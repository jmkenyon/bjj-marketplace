import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";
import { generateTenantURL } from "@/app/lib/utils";
import { parseSessionDate } from "@/app/lib/helpers";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId, sessionDate } = await req.json();

  if (!classId || !sessionDate) {
    return NextResponse.json(
      { error: "Class ID and session date required" },
      { status: 400 }
    );
  }

  const parsedDate = parseSessionDate(sessionDate);
  if (!parsedDate) {
    return NextResponse.json(
      { error: "Invalid session date" },
      { status: 400 }
    );
  }

  const klass = await prisma.class.findUnique({
    where: { id: classId },
    include: { gym: { include: { dropIn: true } } },
  });

  if (!klass || !klass.gym || !klass.gym.dropIn) {
    return NextResponse.json({ error: "Invalid class" }, { status: 400 });
  }

  const gym = klass.gym;
  const dropIn = gym.dropIn;

  // ✅ Prevent duplicate booking (same class + same day)
  const existing = await prisma.accessPass.findFirst({
    where: {
      userId: session.user.id,
      gymId: gym.id,
      classId,
      sessionDate: parsedDate,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already booked for this date" },
      { status: 409 }
    );
  }

  if (!dropIn) {
    return NextResponse.json(
      { error: "Drop-in pricing not configured" },
      { status: 400 }
    );
  }

  // ✅ FREE CLASS
  if (klass.isFree || dropIn.fee === 0) {
    await prisma.accessPass.create({
      data: {
        type: "DROP_IN",
        userId: session.user.id,
        gymId: gym.id,
        classId,
        sessionDate: parsedDate,
        isPaid: true,
      },
    });

    return NextResponse.json({ success: true });
  }

  // 💳 PAID CLASS
  if (!gym.stripeAccountId) {
    return NextResponse.json(
      { error: "Gym not configured for payments" },
      { status: 400 }
    );
  }

  const amount = Math.round(dropIn.fee * 100);
  const platformFee = Math.round(amount * 0.1);

  const checkout = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      metadata: {
        userId: session.user.id,
        gymId: gym.id,
        classId,
        sessionDate,
      },
      line_items: [
        {
          price_data: {
            currency: gym.currency.toLowerCase(),
            product_data: { name: `Drop-in at ${gym.name}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
      },
      success_url: `${generateTenantURL(gym.slug)}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/dashboard/drop-in`,
    },
    { stripeAccount: gym.stripeAccountId }
  );

  return NextResponse.json({ checkoutUrl: checkout.url });
}
