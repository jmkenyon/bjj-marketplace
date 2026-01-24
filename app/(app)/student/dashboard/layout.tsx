import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import OptionsPanel from "../../gym/[gymSlug]/admin/components/OptionsPanel";
import NavbarStudent from "./components/NavbarStudent";

export const metadata: Metadata = {
  title: "BJJ Desk | Admin Dashboard",
  description:
    "BJJ Desk helps Brazilian Jiu-Jitsu gyms manage students, memberships, attendance, and payments — all in one simple platform.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "VISITOR") {
    redirect("/");
  }

  return (
    <>
      <NavbarStudent />
      <div className="flex min-h-screen bg-neutral-100">
        <OptionsPanel session={session} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </>
  );
}
