import EmptyState from "@/app/(app)/components/EmptyState";
import { LoginView } from "./components/LoginView";
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
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  return <LoginView gymName={gym.name} gymSlug={gym.slug} role={"Admin"} />;
};

export default page;
