import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/prisma";
import EmptyState from "@/app/components/EmptyState";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return (
      <EmptyState
        title="Gym not found"
        subtitle="Please contact us for assistance"
      />
    );
  }

  return (
    <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Your subscription
        </h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Manage your gym’s subscription and billing.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Current plan:</span>

          <span
            className={`
          rounded-full px-3 py-1  font-medium
          ${
            gym.plan === "TRIAL"
              ? "bg-yellow-100 text-yellow-800"
              : gym.plan === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-slate-200 text-slate-700"
          }
        `}
          >
            {gym.plan === "TRIAL"
              ? "Free trial"
              : gym.plan === "ACTIVE"
              ? "Paid plan"
              : "Cancelled"}
          </span>
        </div>

        {gym.plan !== "ACTIVE" && (
          <Button className="bg-black text-white hover:bg-slate-800">
            Upgrade plan
          </Button>
        )}
      </div>
    </section>
  );
};

export default page;
