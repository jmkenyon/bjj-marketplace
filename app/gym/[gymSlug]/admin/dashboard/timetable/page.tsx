import EmptyState from "@/app/components/EmptyState";
import Calendar from "@/app/gym/components/Calendar";
import { ClassModal } from "@/app/gym/components/ClassModal";
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
    where: {gymId: gym.id}
  })



  return (
    <section className="mt-5 rounded-lg border bg-white p-6 shadow-sm mb-6">
      <div className="mb-6">
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
