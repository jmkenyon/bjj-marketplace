import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/route";
import { generateTenantURL } from "@/app/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN" || !session.user.gymId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { email, country } = await request.json();

    if (!email || !country) {
      return NextResponse.json(
        { error: "Email and country are required" },
        { status: 400 }
      );
    }

    const account = await stripe.v2.core.accounts.create({
      display_name: email,
      contact_email: email,
      dashboard: "full",
      defaults: {
        responsibilities: {
          fees_collector: "stripe",
          losses_collector: "stripe",
        },
      },
      identity: {
        country,
        entity_type: "company",
      },
      configuration: {
        customer: {},
        merchant: {
          capabilities: {
            card_payments: { requested: true },
          },
        },
      },
    });

    const gym = await prisma.gym.findUnique({
      where: { id: session.user.gymId },
      select: { slug: true },
    });

    if (!gym) {
      return NextResponse.json({ error: "Gym not found" }, { status: 404 });
    }

    await prisma.gym.update({
      where: { id: session.user.gymId },
      data: {
        stripeAccountId: account.id,
        stripeEnabled: false,
      },
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: "account_onboarding",
      refresh_url: `${generateTenantURL(gym.slug)}/admin/dashboard/payments`,
      return_url: `${generateTenantURL(gym.slug)}/admin/dashboard/payments`,
    });

    return NextResponse.json({
      onboardingUrl: accountLink.url,
    });
  } catch (err: unknown) {
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode ?? 400 }
      );
    }

    

    return NextResponse.json(
      { error: "Unexpected error creating Stripe account" },
      { status: 500 }
    );
  }
}
