import type { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import EmptyState from "@/app/(app)/components/EmptyState";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NavbarAdmin from "../../admin/components/NavbarAdmin";
import OptionsPanel from "../../admin/components/OptionsPanel";

export const metadata: Metadata = {
  title: "BJJ Desk | Admin Dashboard",
  description:
    "BJJ Desk helps Brazilian Jiu-Jitsu gyms manage students, memberships, attendance, and payments — all in one simple platform.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gymSlug: string;
  }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug,
    },
  });

  if (!gym) {
    return (
      <EmptyState
        title="Gym not found"
        subtitle="Contact your gym for assistance"
      />
    );
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.gymId !== gym.id) {
    redirect("/login");
  }

  return (
    <>
      <NavbarAdmin gymName={gym.name} gymSlug={gym.slug} />
      <div className="flex h-[calc(100vh-64px)]">
        <OptionsPanel gymSlug={gym.slug} />
        <main className="flex-1 p-6 bg-neutral-100">{children}</main>
      </div>
    </>
  );
}
