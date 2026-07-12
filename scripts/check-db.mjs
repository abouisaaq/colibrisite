#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  const count = await prisma.siteSetting.count().catch(() => -1);
  console.log("✓ Base de données OK (SQLite local)");
  if (count >= 0) console.log(`✓ ${count} paramètres site en base`);
}

main()
  .catch(() => {
    console.error("\n✗ Base de données inaccessible.\n");
    console.error("  Lancez : npm run setup:local\n");
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
