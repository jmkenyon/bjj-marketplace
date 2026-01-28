import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import EmptyState from "@/app/(app)/components/EmptyState";
import StudentDropInClient from "../components/StudentDropInClient";

export default async function StudentDropInPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // student must be visiting a gym
  if (!session.user.gymId) {
    return (
      <EmptyState
        title="No gym selected"
        subtitle="Choose a gym to book a drop-in."
      />
    );
  }

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
  });

  if (!gym) {
    return <EmptyState title="Gym not found" subtitle="Try again later." />;
  }

  const [classes, dropIn, waiver, signedWaiver] = await Promise.all([
    prisma.class.findMany({ where: { gymId: gym.id } }),
    prisma.dropIn.findUnique({ where: { gymId: gym.id } }),
    prisma.waiver.findUnique({ where: { gymId: gym.id } }),
    prisma.signedWaiver.findFirst({
      where: { userId: session.user.id, gymId: gym.id },
    }),
  ]);

  if (!dropIn) {
    return (
      <EmptyState
        title="Drop-ins unavailable"
        subtitle="This gym isn’t accepting drop-ins right now."
      />
    );
  }

  return (
    <StudentDropInClient
      gym={gym}
      classes={classes}
      dropIn={dropIn}
      waiver={waiver}
      waiverSigned={!!signedWaiver}
      user={session.user}
    />
  );
}
