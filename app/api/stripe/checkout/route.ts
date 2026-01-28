// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import { generateTenantURL } from "@/app/lib/utils";
import crypto from "crypto";

interface CheckoutBody {
  gymId: string;
  classId: string;
  sessionDate?: string; // ISO string
}

export async function POST(req: Request) {
  try {
    /* -------------------------
       AUTH
    -------------------------- */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CheckoutBody;
    const { gymId, classId, sessionDate } = body;

    if (!gymId || !classId) {
      return NextResponse.json(
        { error: "gymId and classId are required" },
        { status: 400 }
      );
    }

    /* -------------------------
       LOAD GYM + PRICING
    -------------------------- */
    const klass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        gym: {
          include: { dropIn: true },
        },
      },
    });

    if (!klass || klass.gymId !== gymId) {
      return NextResponse.json({ error: "Invalid class" }, { status: 400 });
    }

    const gym = klass.gym;
    const dropIn = gym.dropIn;

    if (!dropIn || dropIn.fee <= 0) {
      return NextResponse.json(
        { error: "This class does not require payment" },
        { status: 400 }
      );
    }

    if (!gym.stripeAccountId) {
      return NextResponse.json(
        { error: "Gym is not configured for payments" },
        { status: 400 }
      );
    }

    /* -------------------------
       PREVENT DUPLICATES
    -------------------------- */
    const existing = await prisma.accessPass.findFirst({
      where: {
        userId: session.user.id,
        gymId,
        classId,
        sessionDate: sessionDate ? new Date(sessionDate) : undefined,
        status: "ACTIVE",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already booked for this session" },
        { status: 409 }
      );
    }

    /* -------------------------
       DERIVED PAYMENT DATA
    -------------------------- */
    const amount = Math.round(dropIn.fee * 100);
    const platformFee = Math.round(amount * 0.1);
    const currency = gym.currency.toLowerCase();

    /* -------------------------
       IDEMPOTENCY
    -------------------------- */
    const idempotencyKey = crypto
      .createHash("sha256")
      .update(
        `${session.user.id}:${gymId}:${classId}:${sessionDate ?? "na"}`
      )
      .digest("hex");

    /* -------------------------
       STRIPE CHECKOUT
    -------------------------- */
    const checkoutSession = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Drop-in at ${gym.name}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: platformFee,
          metadata: {
            intent: "DROP_IN",
            userId: session.user.id,
            gymId,
            classId,
            sessionDate: sessionDate ?? "",
          },
        },
        success_url: `${generateTenantURL(gym.slug)}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/dashboard/drop-in?gymId=${gymId}`,
      },
      {
        stripeAccount: gym.stripeAccountId, // ✅ direct charge
        idempotencyKey,
      }
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode ?? 400 }
      );
    }

    console.error("[STRIPE_CHECKOUT_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}