// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";


interface CheckoutBody {
  amount: number; // in cents
  currency: string;
  gymStripeAccountId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    const {
      amount,
      currency,
      gymStripeAccountId,
      successUrl,
      cancelUrl,
    } = body;

    if (!amount || !currency || !gymStripeAccountId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const platformFee = Math.round(amount * 0.1); // 10%

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: "Drop-in class",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: platformFee,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
      {
        stripeAccount: gymStripeAccountId, // 🔑 direct charge
      }
    );




    return NextResponse.json({ url: session.url });
  } catch (err) {
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