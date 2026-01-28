import prisma from "@/app/lib/prisma";
import NavbarDashboard from "./admin/components/NavbarDashboard";
import EmptyState from "@/app/(app)/components/EmptyState";
import Calendar from "./admin/components/Calendar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateTenantURL } from "@/app/lib/utils";
import GymMap from "../components/Map";

interface IParams {
  gymSlug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<IParams>;
}) {
  const resolvedParams = await params;
  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
    select: {
      name: true,
      address: true,
      about: true,
    },
  });

  if (!gym) {
    return { title: "Gym not found | BJJ Mat" };
  }

  const city = gym.address?.split(",")[0] ?? "";

  return {
    title: `${gym.name} | BJJ Gym${city ? ` in ${city}` : ""}`,
    description:
      gym.about ??
      `Drop in and train Brazilian Jiu-Jitsu at ${gym.name}. View timetable and book a visit.`,
    openGraph: {
      title: `${gym.name} | BJJ Mat`,
      description: gym.about ?? `Drop in and train at ${gym.name}.`,
      type: "website",
    },
  };
}

const GymPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
    include: {
      dropIn: true,
      classes: true,
    },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  const baseUrl = generateTenantURL(gym.slug);

  return (
    <main className="min-h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />

      <section className="space-y-16 px-6 py-12 lg:px-12">
        {/* About */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Train at {gym.name}
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            {gym.about ||
              "Visit this academy for drop-ins, free trials, and open training."}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white px-8 py-10 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Visiting or new to the area?
            </h2>
            <p className="max-w-sm text-center text-sm text-slate-600">
              Book a class — no awkward messages, no guesswork.
            </p>

            {gym.dropIn ? (
              <Button
                size="lg"
                className="rounded-xl bg-black px-8 text-white hover:bg-neutral-800"
                asChild
              >
                <Link href={`${baseUrl}/drop-in`}>Book drop-in</Link>
              </Button>
            ) : null}
          </div>
        </div>

        {/* Timetable */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Class Timetable
            </h2>
            <p className="text-sm text-slate-600">
              Weekly schedule for visitors and members
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <Calendar classes={gym.classes} />
          </div>
        </div>

        {/* Location */}
        {gym.address && (
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Location</h2>

            <div className="mx-auto w-full max-w-xl rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-800">
                {gym.address}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  gym.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center text-sm font-medium text-blue-600 hover:underline"
              >
                View on Google Maps
              </a>
            </div>
            <GymMap
              center={
                gym.latitude && gym.longitude
                  ? [gym.latitude, gym.longitude]
                  : undefined
              }
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default GymPage;
