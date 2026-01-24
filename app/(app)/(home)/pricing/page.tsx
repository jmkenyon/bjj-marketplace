import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      {/* HERO */}
      <section className="mb-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Simple, fair pricing
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-neutral-600">
          No subscriptions. No contracts. You only pay when someone drops in and
          trains.
        </p>
      </section>

      {/* PRICING CARD */}
      <section className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Pay as you go
          </p>
          <div className="mt-4 text-5xl font-semibold text-neutral-900">
            5%
          </div>
          <p className="mt-2 text-neutral-600">
            per drop-in booking
          </p>
        </div>

        <ul className="mt-8 space-y-4">
          {[
            "Free to list your gym",
            "No monthly subscription",
            "Only pay when you get paid",
            "Secure payments via Stripe",
            "Students can book & pay online",
            "QR code for in-gym drop-ins",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
              <span className="text-neutral-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link
            href="/list-your-gym"
            className="
              block w-full rounded-lg bg-black px-6 py-3 text-center
              font-semibold text-white transition hover:bg-neutral-800
            "
          >
            List your gym
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-24 grid gap-10 sm:grid-cols-2">
        <Faq
          q="Do I pay anything upfront?"
          a="No. Listing your gym is completely free. You only pay when a student books and pays for a drop-in."
        />
        <Faq
          q="What if nobody books?"
          a="Then you pay nothing. No bookings, no fees."
        />
        <Faq
          q="How do I get paid?"
          a="Payments go directly to your Stripe account. We never touch your money."
        />
        <Faq
          q="Can I set free classes or open mats?"
          a="Yes. You can mark classes as free, and students won’t be charged."
        />
      </section>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="font-semibold text-neutral-900">{q}</h3>
      <p className="mt-2 text-sm text-neutral-600">{a}</p>
    </div>
  );
}