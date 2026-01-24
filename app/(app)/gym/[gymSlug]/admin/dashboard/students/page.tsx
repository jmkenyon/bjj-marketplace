import StudentsTable from "@/app/(app)/gym/[gymSlug]/admin/components/StudentsTable";
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
    include: {
      users: {
        where: {
          role: "VISITOR",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  const accessPasses = await prisma.accessPass.findMany({
    where: {
      gymId: gym.id,
      user: {
        isNot: undefined,
      },
    },
    include: { user: true },
  });

  const students = Array.from(
    new Map(accessPasses.map((ap) => [ap.user.id, ap.user])).values()
  );

  return (
    <section className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Students</h1>
          <p className="mt-1 max-w-prose text-sm text-neutral-600">
            People who have trained at your gym via drop-ins or visits.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl ">
        <StudentsTable students={students} />
      </div>
    </section>
  );
};

export default page;
