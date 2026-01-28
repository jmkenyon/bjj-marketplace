import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PaymentsClient from "../../components/PaymentsClient";


export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN" || !session.user.gymId) {
    redirect("/login");
  }

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },

  });

  if (!gym) {
    redirect("/login");
  }

  return (
    <PaymentsClient
      gym={gym}
      stripeAccountId={gym.stripeAccountId}
      stripeEnabled={gym.stripeEnabled}
      adminEmail={session.user.email!}
    />
  );
}