import Image from "next/image";
import Navbar from "./(app)/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <Navbar />

      <section className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-24 lg:flex-row">
        {/* Left Content */}
        <div className="flex max-w-xl flex-col gap-6">
          <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Built for BJJ travelers 🌍
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Train anywhere.
            <br />
            <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Just show up and roll.
            </span>
          </h1>

          <p className="text-lg text-neutral-600">
            Find Brazilian Jiu-Jitsu academies worldwide, book drop-ins, sign
            waivers, and train without awkward DMs or guesswork.
          </p>

          {/* Gym owners card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Gym owners
            </p>
            <p className="text-base text-neutral-700">
              Get discovered by traveling grapplers and automate drop-ins,
              trials, and payments.
            </p>
            <Link
              href="/list-your-gym"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              List your gym for free →
            </Link>
          </div>

          {/* Primary CTAs */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/explore"
              className="rounded-xl bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 shadow-lg shadow-black/10"
            >
              Explore academies
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl bg-white px-8 py-4 text-sm font-semibold text-neutral-900 ring-1 ring-neutral-200 transition hover:bg-neutral-50"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-tr from-blue-200/40 to-transparent blur-3xl" />

          <div className="overflow-hidden rounded-3xl border border-neutral-200 shadow-2xl">
            <Image
              src="/hero-image.webp"
              alt="BJJ drop-in marketplace preview"
              width={900}
              height={900}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
