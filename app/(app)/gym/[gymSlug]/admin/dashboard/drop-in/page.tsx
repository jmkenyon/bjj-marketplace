import EmptyState from "@/app/(app)/components/EmptyState";
import prisma from "@/app/lib/prisma";
import QrView from "../../components/QrView";

interface IParams {
  gymSlug: string;
}

const Page = async ({ params }: { params: Promise<IParams> }) => {
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

  const dropIn = await prisma.dropIn.findUnique({
    where: { gymId: gym.id },
  });

  return (
    <section className="mt-10 ">
      <QrView gym={gym} dropIn={dropIn} />
    </section>
  );
};

export default Page;
