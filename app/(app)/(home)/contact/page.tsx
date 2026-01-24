import Link from "next/link";
import { Mail, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* HERO */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Get in touch
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-neutral-600">
          Questions, feedback, or want to list your gym? We’d love to hear from you.
        </p>
      </section>

      {/* CONTENT */}
      <div className="grid gap-10 sm:grid-cols-2">
        {/* CONTACT */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Contact us
            </h2>
          </div>

          <p className="mt-4 text-sm text-neutral-600">
            For general enquiries, partnerships, or gym onboarding, email us at:
          </p>

          <p className="mt-3 text-sm font-medium">
            <a
              href="mailto:contact@bjjdesk.io"
              className="text-black underline-offset-4 hover:underline"
            >
              contact@bjjdesk.io
            </a>
          </p>

          <p className="mt-6 text-xs text-neutral-500">
            We usually reply within 24 hours.
          </p>
        </div>

        {/* HELP */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Need help?
            </h2>
          </div>

          <p className="mt-4 text-sm text-neutral-600">
            If you’re a gym owner or student and something isn’t working as expected,
            drop us an email with as much detail as possible.
          </p>

          <p className="mt-6 text-sm text-neutral-600">
            You can also check out:
          </p>

          <ul className="mt-3 space-y-2 text-sm">
            <li>
              →{" "}
              <Link
                href="/how-it-works"
                className="font-medium text-black hover:underline"
              >
                How it works
              </Link>
            </li>
            <li>
              →{" "}
              <Link
                href="/pricing"
                className="font-medium text-black hover:underline"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}