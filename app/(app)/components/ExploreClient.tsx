"use client";

import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import GymCard from "./GymCard";
import { ExploreGym } from "@/app/types/types";

interface ExploreClientProps {
  gyms: ExploreGym[];
}

export default function ExploreClient({ gyms }: ExploreClientProps) {
  const [query, setQuery] = useState("");
  const [showFreeClassesOnly, setShowFreeClassesOnly] = useState(false);

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) => {
      const matchesQuery =
        gym.name.toLowerCase().includes(query.toLowerCase()) ||
        gym.address?.toLowerCase().includes(query.toLowerCase());

      const matchesFreeClasses =
        !showFreeClassesOnly || gym.classes.some((c) => c.isFree);

      return matchesQuery && matchesFreeClasses;
    });
  }, [gyms, query, showFreeClassesOnly]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* HERO */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Find a BJJ gym anywhere
        </h1>
        <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
          Discover Brazilian Jiu-Jitsu gyms, check drop-in availability, and
          train wherever you are.
        </p>
      </section>

      {/* SEARCH + FILTERS */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <Filters
          showFreeClassesOnly={showFreeClassesOnly}
          setShowFreeClassesOnly={setShowFreeClassesOnly}
        />
      </div>

      {/* RESULTS */}
      {filteredGyms.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-neutral-600">
          No gyms found. Try adjusting your search.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      )}
    </div>
  );
}
