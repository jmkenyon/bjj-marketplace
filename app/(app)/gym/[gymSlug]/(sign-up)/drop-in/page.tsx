import EmptyState from "@/app/(app)/components/EmptyState";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DropInView from "../../../views/DropInView";
import NavbarDashboard from "../../admin/components/NavbarDashboard";
import { redirect } from "next/navigation";

interface IParams {
  gymSlug: string;
}

const DropInPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact the gym for help" />
    );
  }

  const waiver = await prisma.waiver.findUnique({
    where: { gymId: gym.id },
  });

  const classes = await prisma.class.findMany({
    where: { gymId: gym.id },
  });

  const dropIn = await prisma.dropIn.findUnique({
    where: { gymId: gym.id },
  });

  if (!dropIn) {
    return (
      <EmptyState
        title="Drop-ins unavailable"
        subtitle="This gym is not currently accepting drop-ins"
      />
    );
  }

  const session = await getServerSession(authOptions);

  const isStudent = session?.user?.role === "VISITOR";

  if (isStudent) {
    redirect(`/student/dashboard/drop-in?gymId=${gym.id}`);
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />

      <section className="mx-auto max-w-5xl space-y-12 px-6 py-12">
        {/* Hero */}
        <header className="text-center space-y-4">
          <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
            Drop-in session
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Train at {gym.name}
          </h1>

          <p className="mx-auto max-w-xl text-base text-neutral-600">
            Complete the form below to book a single drop-in session.
          </p>
        </header>

        {/* Existing account */}
        <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
          <h2 className="text-sm font-medium text-neutral-900">
            Already have a BJJ Mat account?
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Log in to book in seconds.
          </p>

          <Button
            asChild
            className="mt-4 bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/login?callbackUrl=${encodeURIComponent(
                `/student/dashboard/drop-in?gymId=${gym.id}`
              )}`}
            >
              Student login
            </Link>
          </Button>
        </div>

        {/* Drop-in form */}
        <DropInView
          gym={gym}
          waiver={waiver}
          dropIn={dropIn}
          classes={classes}
        />
      </section>
    </main>
  );
};

export default DropInPage;
