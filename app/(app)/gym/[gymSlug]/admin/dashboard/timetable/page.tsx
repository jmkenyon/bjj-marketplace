import Calendar from "@/app/(app)/gym/[gymSlug]/admin/components/Calendar";
import { ClassModal } from "@/app/(app)/gym/[gymSlug]/admin/components/ClassModal";
import EmptyState from "@/app/(app)/components/EmptyState";

import prisma from "@/app/lib/prisma";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug,
    },
  });

  if (!gym) {
    return (
      <EmptyState
        title="Gym not found"
        subtitle="Contact your gym for assistance"
      />
    );
  }

  const classes = await prisma.class.findMany({
    where: { gymId: gym.id },
  });

  return (
    <section className="h-full bg-neutral-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Weekly timetable</h2>
        <p className="mt-1 mb-2 max-w-prose text-sm text-slate-600">
          Update your weekly timetable here
        </p>
        <ClassModal gymId={gym.id} />
      </div>

      <Calendar classes={classes} />
    </section>
  );
};

export default page;
