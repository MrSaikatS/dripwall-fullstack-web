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
    // Seed categories (no dependencies)
    const categories = await prisma.$transaction([
      prisma.category.upsert({
        where: { slug: "nature" },
        update: {},
        create: {
          name: "Nature",
          slug: "nature",
          description: "Natural landscapes and scenery",
          imageUrl: "/images/categories/nature.jpg",
        },
      }),
      prisma.category.upsert({
        where: { slug: "abstract" },
        update: {},
        create: {
          name: "Abstract",
          slug: "abstract",
          description: "Abstract and artistic wallpapers",
          imageUrl: "/images/categories/abstract.jpg",
        },
      }),
      prisma.category.upsert({
        where: { slug: "technology" },
        update: {},
        create: {
          name: "Technology",
          slug: "technology",
          description: "Tech and digital art wallpapers",
          imageUrl: "/images/categories/technology.jpg",
        },
      }),
      prisma.category.upsert({
        where: { slug: "anime" },
        update: {},
        create: {
          name: "Anime",
          slug: "anime",
          description: "Anime and manga-inspired wallpapers",
          imageUrl: "/images/categories/anime.jpg",
        },
      }),
      prisma.tag.upsert({
        where: { slug: "minimalist" },
        update: {},
        create: { name: "Minimalist", slug: "minimalist" },
      }),
      prisma.tag.upsert({
        where: { slug: "dark" },
        update: {},
        create: { name: "Dark", slug: "dark" },
      }),
      prisma.tag.upsert({
        where: { slug: "4k" },
        update: {},
        create: { name: "4K", slug: "4k" },
      }),
      prisma.tag.upsert({
        where: { slug: "vibrant" },
        update: {},
        create: { name: "Vibrant", slug: "vibrant" },
      }),
    ]);

    console.log(`✅ Seeded ${categories.length} categories/tags`);

    // Seed admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@dripwall.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@dripwall.com",
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            providerId: "credential",
            accountId: "admin@dripwall.com",
            password: adminPassword,
          },
        },
      },
    });

    console.log(`✅ Seeded admin user: ${adminUser.email}`);

    // Seed a regular demo user
    const userPassword = await hashPassword("user123");
    const demoUser = await prisma.user.upsert({
      where: { email: "user@dripwall.com" },
      update: {},
      create: {
        name: "Demo User",
        email: "user@dripwall.com",
        emailVerified: true,
        role: "user",
        accounts: {
          create: {
            providerId: "credential",
            accountId: "user@dripwall.com",
            password: userPassword,
          },
        },
      },
    });

    console.log(`✅ Seeded demo user: ${demoUser.email}`);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    console.log("\n🔌 Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected successfully");
  }
};

main().catch((e) => {
  console.error("💥 Fatal error during seeding:", e);
  process.exit(1);
});
