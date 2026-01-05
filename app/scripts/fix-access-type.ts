import prisma from "@/app/lib/prisma";

async function main() {
  const result = await prisma.user.updateMany({
    where: { type: undefined },
    data: { type: "NONE" },
  });

  console.log("Updated users:", result.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });