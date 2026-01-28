import prisma from "@/app/lib/prisma";

async function main() {
  const result = await prisma.accessPass.updateMany({
    where: {
      sessionDate: { isSet: false },
    },
    data: {
      sessionDate: new Date(),
    },
  });
  console.log(`Updated ${result.count} access passes`);
}

const sample = await prisma.accessPass.findFirst();
console.log(sample);

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
