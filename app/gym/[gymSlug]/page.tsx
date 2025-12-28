import prisma from "@/app/lib/prisma"

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


  return (
    <div>Welcome {gym?.name}</div>
  )
}

export default GymPage