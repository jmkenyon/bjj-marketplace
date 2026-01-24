import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import StudentSettingsClient from "../components/StudentSettings";



export default async function StudentSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return <StudentSettingsClient user={user} />;
}