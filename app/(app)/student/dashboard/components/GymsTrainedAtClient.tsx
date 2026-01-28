"use client";

import { generateTenantURL } from "@/app/lib/utils";
import Link from "next/link";

interface Gym {
  id: string;
  name: string;
  slug: string;
  address: string | null;
}

export default function GymsTrainedAtClient({ gyms }: { gyms: Gym[] }) {
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Gyms you’ve trained at
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          A record of every gym you’ve visited via BJJ Mat.
        </p>
      </header>

      {gyms.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-neutral-600">
          You haven’t trained at any gyms yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-xl border bg-white p-5 transition hover:shadow-sm"
            >
              <h3 className="font-medium text-neutral-900">{gym.name}</h3>

              {gym.address && (
                <p className="mt-1 text-sm text-neutral-600">
                  {gym.address}
                </p>
              )}

              <div className="mt-4">
                <Link
                  href={`${generateTenantURL(gym.slug)}`}
                  className="text-sm font-medium text-black underline hover:opacity-80"
                >
                  View gym →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}