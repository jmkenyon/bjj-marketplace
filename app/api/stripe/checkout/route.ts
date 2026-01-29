// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/app/lib/prisma";
import Stripe from "stripe";
import crypto from "crypto";
import { generateTenantURL } from "@/app/lib/utils";
import { parseSessionDate } from "@/app/lib/helpers";

interface CheckoutBody {
  classId: string;
  sessionDate: string; // YYYY-MM-DD
  email?: string;
  firstName?: string;
  lastName?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const { classId, sessionDate, email, firstName, lastName } = body;

    if (!classId || !sessionDate) {
      return NextResponse.json(
        { error: "classId and sessionDate are required" },
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

    /* -------------------------
       LOAD CLASS + GYM
    -------------------------- */
    const klass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        gym: {
          include: { dropIn: true },
        },
      },
    });

    if (!klass || !klass.gym || !klass.gym.dropIn) {
      return NextResponse.json(
        { error: "Invalid class or drop-ins unavailable" },
        { status: 400 }
      );
    }

    const gym = klass.gym;
    const dropIn = gym.dropIn;

    /* -------------------------
       FREE CLASS → NO STRIPE

    -------------------------- */
    if (!dropIn) {
      return NextResponse.json(
        { error: "Drop-ins are not available for this gym" },
        { status: 400 }
      );
    }

    if (klass.isFree || dropIn.fee === 0) {
      return NextResponse.json({
        free: true,
        message: "Free drop-in – no payment required",
      });
    }

    /* -------------------------
       STRIPE CONFIG CHECK
    -------------------------- */
    if (!gym.stripeAccountId) {
      return NextResponse.json(
        { error: "Gym is not configured for payments" },
        { status: 400 }
      );
    }

    /* -------------------------
       PAYMENT CALCULATION
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
        [
          "dropin",
          gym.stripeAccountId, // 🔑 connect scope
          classId,
          sessionDate,
          email ?? "",
          firstName ?? "",
          lastName ?? "",
        ].join(":")
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

        // 🔑 SESSION-LEVEL METADATA (WEBHOOK READS THIS)
        metadata: {
          intent: "DROP_IN",
          gymId: gym.id,
          classId,
          sessionDate,
          email: email ?? "",
          firstName: firstName ?? "",
          lastName: lastName ?? "",
        },

        payment_intent_data: {
          application_fee_amount: platformFee,
        },

        success_url: `${generateTenantURL(gym.slug)}/success`,
        cancel_url: `${generateTenantURL(gym.slug)}/drop-in`,
      },
      {
        stripeAccount: gym.stripeAccountId,
        idempotencyKey,
      }
    );

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (err) {
    console.error("[STRIPE_CHECKOUT_ERROR]", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode ?? 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
