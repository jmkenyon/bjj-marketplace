import SettingsForm from "@/app/(app)/gym/[gymSlug]/admin/components/SettingsForm";
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
    return null;
  }

  return (


      <SettingsForm gym={gym} />
    
  );
};

export default page;
