import prisma from "@/app/lib/prisma";

async function main() {
  const result = await prisma.accessPass.deleteMany({
    where: {
      user: {
        is: undefined,
      },
    },
  });

  console.log(`Deleted ${result.count} orphaned access passes`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());