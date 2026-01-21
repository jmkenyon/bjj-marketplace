import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      membership: true,
      gym: true,
      accessPasses: true,
    },
  });
}
