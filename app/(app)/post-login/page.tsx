import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { generateTenantURL } from "../lib/utils";

export default async function PostLogin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.gymId) {
    redirect("/login");
  }

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
    select: { slug: true },
  });

  if (!gym) {
    redirect("/login");
  }

  redirect(generateTenantURL(gym.slug));
}
