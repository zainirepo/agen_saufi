import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function upsertUser(name: string, email: string, password: string, role: "CEO" | "ADMIN") {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role },
    create: { name, email, passwordHash, role },
  });
  console.log(`Seeded ${role}: ${email}`);
}

async function main() {
  const ceoEmail = process.env.SEED_CEO_EMAIL ?? "saufi@agen-saufi.local";
  const ceoPassword = process.env.SEED_CEO_PASSWORD ?? "ubah-password-ini";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@agen-saufi.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ubah-password-ini-juga";

  await upsertUser("Saufi", ceoEmail, ceoPassword, "CEO");
  await upsertUser("Admin", adminEmail, adminPassword, "ADMIN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
