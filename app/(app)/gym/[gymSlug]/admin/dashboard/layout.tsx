import type { Metadata } from "next";
import prisma from "@/app/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NavbarAdmin from "../components/NavbarAdmin";
import OptionsPanel from "../components/OptionsPanel";

export const metadata: Metadata = {
  title: "BJJ Desk | Admin Dashboard",
  description:
    "Manage students, access passes, drop-ins, waivers, and gym settings.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gymSlug: string;
  }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { gymSlug } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const gym = await prisma.gym.findUnique({
    where: { slug: gymSlug },
  });

  if (!gym || session.user.gymId !== gym.id) {
    redirect("/login");
  }

  return (
    <>
      <NavbarAdmin gymName={gym.name} gymSlug={gym.slug} />

      <div className="flex h-[calc(100vh-64px)] min-h-0 bg-neutral-100">
        <OptionsPanel session={session} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </>
  );
}
