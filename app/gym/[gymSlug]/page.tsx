import prisma from "@/app/lib/prisma"
import NavbarDashboard from "../components/NavbarDashboard";
import EmptyState from "@/app/components/EmptyState";

interface IParams {
    gymSlug: string;
  }

const GymPage = async ({ params }: { params: Promise<IParams> }) => {
    const resolvedParams = await params;
    console.log(resolvedParams)

  const gym = await prisma.gym.findUnique({
    where: { 
        slug: resolvedParams.gymSlug,
    }
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    )
  }


  return (
    <main className="h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug}/>
      
    </main>
  )
}

export default GymPage