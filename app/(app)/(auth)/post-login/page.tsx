import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { generateTenantURL } from "@/app/lib/utils";

export default async function PostLogin({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const resolvedParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  if (resolvedParams?.callbackUrl) {
    const callbackUrl = resolvedParams.callbackUrl;
    if (
      typeof callbackUrl === "string" &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("//")
    ) {
      redirect(callbackUrl);
    }
  }

  // 🔹 STUDENT / VISITOR → platform dashboard
  if (session.user.role === "VISITOR") {
    redirect("/student/dashboard");
  }

  // 🔹 ADMIN → gym tenant dashboard
  if (!session.user.gymId) {
    redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
    select: { slug: true },
  });

  if (!gym) {
    redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  redirect(`${generateTenantURL(gym.slug)}/admin/dashboard/information`);
}
