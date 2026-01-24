import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import GymsTrainedAtClient from "../components/GymsTrainedAtClient";


export default async function GymsTrainedAtPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const accessPasses = await prisma.accessPass.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          slug: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Deduplicate gyms
  const gyms = Array.from(
    new Map(accessPasses.map((p) => [p.gym.id, p.gym])).values()
  );

  return <GymsTrainedAtClient gyms={gyms} />;
}