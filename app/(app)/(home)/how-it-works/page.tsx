import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function HowItWorksPage() {
  return (
    <main className="bg-neutral-100">

      {/* HERO */}
      <section className="px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
          How BJJ Mat works
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">
          Drop in. Train anywhere. No awkward front desk moments.
        </p>
      </section>

      {/* FOR STUDENTS */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold text-neutral-900 mb-12">
            For students
          </h2>

          <div className="grid gap-10 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Find a gym",
                text: "Search for BJJ gyms anywhere in the world. See schedules, drop-in availability, and free classes.",
              },
              {
                step: "02",
                title: "Choose a class",
                text: "Pick the class you want to attend — open mat, gi, no-gi, or free sessions.",
              },
              {
                step: "03",
                title: "Book & sign",
                text: "Pay online if required and sign the waiver once. No printing. No paperwork.",
              },
              {
                step: "04",
                title: "Just show up",
                text: "You’re booked. The gym already has your details. Train stress-free.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border bg-neutral-50 p-6"
              >
                <div className="text-sm font-medium text-neutral-400">
                  {item.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR GYMS */}
      <section className="px-6 py-20 bg-neutral-100">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold text-neutral-900 mb-12">
            For gyms
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "List your gym",
                text: "Create a public gym page with your schedule, location, and drop-in options.",
              },
              {
                step: "02",
                title: "Set drop-in rules",
                text: "Choose prices, mark free classes, and upload your waiver once.",
              },

              {
                step: "03",
                title: "Show up & teach",
                text: "No cash handling. No forms. Students arrive pre-registered.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border bg-white p-6">
                <div className="text-sm font-medium text-neutral-400">
                  {item.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Built for real gyms
          </h2>
          <p className="mt-4 text-neutral-600">
            BJJ Mat is designed specifically for Brazilian Jiu-Jitsu gyms. No
            bloated features. No generic fitness software.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 text-sm text-neutral-600">
            <div className="rounded-lg border p-4">✔ Waivers signed once</div>
            <div className="rounded-lg border p-4">✔ Secure payments</div>
            <div className="rounded-lg border p-4">✔ No monthly contracts</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-neutral-900">
        <h2 className="text-3xl font-semibold text-white">
          Ready to get started?
        </h2>
        <p className="mt-3 text-neutral-300">
          Whether you’re travelling or running a gym — BJJ Mat has you covered.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-white text-black hover:bg-neutral-200">
            <Link href="/explore">Find a gym</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="text-white bg-black border-white"
          >
            <Link href="/list-your-gym">List your gym</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
