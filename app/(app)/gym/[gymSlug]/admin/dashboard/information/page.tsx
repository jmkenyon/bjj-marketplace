import SettingsForm from "@/app/(app)/gym/[gymSlug]/admin/components/SettingsForm";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug,
    },
  });

  if (!gym) {
    return null;
  }

  return <SettingsForm gym={gym} adminEmail={session.user.email!} />;
};

export default page;
