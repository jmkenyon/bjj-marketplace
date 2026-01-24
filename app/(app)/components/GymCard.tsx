import Link from "next/link";
import { generateTenantURL } from "@/app/lib/utils";

import { ExploreGym } from "@/app/types/types";

export default function GymCard({ gym }: { gym: ExploreGym }) {
  return (
    <Link
      href={generateTenantURL(gym.slug)}
      className="group rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-neutral-900 group-hover:underline">
          {gym.name}
        </h3>

        {gym.address && (
          <p className="text-sm text-neutral-500">{gym.address}</p>
        )}

        {gym.about && (
          <p className="line-clamp-3 text-sm text-neutral-600">{gym.about}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          {gym.classes?.some((c) => c.isFree) && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
              Free classes
            </span>
          )}

          <span className="text-xs text-neutral-400">View gym →</span>
        </div>
      </div>
    </Link>
  );
}
