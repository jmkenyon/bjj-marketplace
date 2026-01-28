// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";
import { stripe } from "@/lib/stripe";
import { parseSessionDate } from "@/app/lib/helpers";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  /* ----------------------------
     CONNECT ONBOARDING
  ----------------------------- */
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;

    if (account.charges_enabled && account.payouts_enabled) {
      await prisma.gym.updateMany({
        where: { stripeAccountId: account.id },
        data: { stripeEnabled: true },
      });
    }
  }

  /* ----------------------------
     PAYMENT COMPLETED
  ----------------------------- */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    if (!session.payment_intent || !session.metadata) {
      return NextResponse.json({ received: true });
    }

    const { gymId, classId, userId, email, sessionDate, firstName, lastName } =
      session.metadata;

      const parsedSessionDate = parseSessionDate(sessionDate);


    if (!parsedSessionDate || isNaN(parsedSessionDate.getTime())) {
      console.warn("Invalid or missing sessionDate");
      return NextResponse.json({ received: true });
    }

    // Resolve or create user
    let user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : email
      ? await prisma.user.findUnique({ where: { email } })
      : null;

    if (!user && email) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          role: "VISITOR",
        },
      });
    }

    if (!user) return NextResponse.json({ received: true });

    // Prevent duplicates
    const existing = await prisma.accessPass.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (!existing) {
      await prisma.accessPass.create({
        data: {
          type: "DROP_IN",
          gymId,
          classId,
          sessionDate: parsedSessionDate,
          userId: user.id,
          isPaid: true,
          stripeSessionId: session.id,
        },
      });

      await prisma.payment.create({
        data: {
          userId: user.id,
          gymId,
          amount: session.amount_total ?? 0,
          currency: session.currency?.toUpperCase() ?? "USD",
          description: "Drop-in class",
          stripeIntentId: session.payment_intent as string,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
