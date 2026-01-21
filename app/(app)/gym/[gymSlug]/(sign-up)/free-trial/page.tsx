import EmptyState from "@/app/(app)/components/EmptyState";
import prisma from "@/app/lib/prisma";
import SignupForm from "../../admin/components/SignupForm";
import NavbarDashboard from "../../admin/components/NavbarDashboard";

interface IParams {
  gymSlug: string;
}

const Page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return <EmptyState title="Gym not found" subtitle="" />;
  }

  const waiver = await prisma.waiver.findUnique({
    where: { gymId: gym.id },
  });

  return (
    <main className="min-h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />

      <section className="space-y-14 px-6 py-12 lg:px-12">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
            Free trial
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Try a free class at {gym.name}
          </h1>

          <p className="text-base text-neutral-600">
            New to the gym or just visiting? Book a free trial session — no
            payment, no commitment.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", label: "Tell us about you" },
            { step: "2", label: "Waiver & safety" },
            { step: "3", label: "Turn up & train" },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-xl border bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                {s.step}
              </div>
              <p className="text-sm font-medium text-neutral-800">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <SignupForm waiver={waiver} gym={gym} freeTrial />
      </section>
    </main>
  );
};

export default Page;
