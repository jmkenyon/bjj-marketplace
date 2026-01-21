import EmptyState from "@/app/(app)/components/EmptyState";

import prisma from "@/app/lib/prisma";
import { WaiverView } from "../../components/WaiverView";

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

  const waiver = await prisma.waiver.findFirst({
    where: {
      gymId: gym.id,
    },
  });

  return <WaiverView waiverContent={waiver} />;
};

export default page;
