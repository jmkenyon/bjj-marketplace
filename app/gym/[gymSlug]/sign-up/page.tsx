import EmptyState from "@/app/components/EmptyState";
import NavbarDashboard from "../../components/NavbarDashboard";
import prisma from "@/app/lib/prisma";
import SignupForm from "../../components/SignupForm";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return <EmptyState title="Gym not found" subtitle="" />;
  }

  const memberships = await prisma.membership.findMany({
    where: { gymId: gym.id },
  });

  const waiver = await prisma.waiver.findUnique({
    where: {
      gymId: gym.id,
    },
  });

  return (
    <main className="h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />
      <section className="space-y-16 px-6 py-12 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sign up to {gym.name}
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            Follow the instructions below to start training!
          </p>
        </div>
        <SignupForm memberships={memberships} waiver={waiver}/>
      </section>
    </main>
  );
};

export default page;
