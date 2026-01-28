import prisma from "@/app/lib/prisma";
import ExploreClient from "../../components/ExploreClient";



export const metadata = {
  title: "Explore BJJ Gyms | BJJ Mat",
  description:
    "Find Brazilian Jiu-Jitsu gyms near you. Browse drop-in friendly gyms, view schedules, and train anywhere.",
};

export default async function ExplorePage() {
  const gyms = await prisma.gym.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      about: true,
      currency: true,
      dropIn: {
        select: {
          fee: true,
        },
      },

      classes: {
        select: { isFree: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-neutral-100">

      <ExploreClient gyms={gyms} />
    </div>
  );
}
