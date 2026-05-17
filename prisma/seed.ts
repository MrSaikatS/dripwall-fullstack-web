import { serverEnv } from "@/lib/env/serverEnv";
import { PrismaClient } from "@generated/prisma/client";
import { hash as argon2Hash } from "@node-rs/argon2";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Initialize Prisma Client with the same adapter as the main application
const adapter = new PrismaLibSql({
  url: serverEnv.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Helper function to hash passwords
const hashPassword = async (password: string) => {
  return await argon2Hash(password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });
};

// Main seed function
const main = async () => {
  console.log("🚀 Starting database seeding...");

  try {
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
};

main()
  .then(async () => {
    console.log("\n🔌 Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected successfully");
  })
  .catch(async (e) => {
    console.error("💥 Fatal error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
