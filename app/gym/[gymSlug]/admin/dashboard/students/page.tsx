import EmptyState from "@/app/components/EmptyState";
import { Modal } from "@/app/gym/components/Modal";
import StudentsTable from "@/app/gym/components/StudentsTable";
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
          role: "STUDENT",
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  return (
    <section className="h-full bg-neutral-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Students</h2>
        <p className="mt-1 mb-2 text-sm text-slate-600 max-w-prose">
          Manage your students here.
        </p>

        <Modal gym={gym} />
      </div>
      <div className="pb-2">
      <StudentsTable gym={gym} />
      </div>
    </section>
  );
};

export default page;
