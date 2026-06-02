import { serverEnv } from "@/lib/env/serverEnv";
import { PrismaClient } from "@generated/prisma/client";
import { hash as argon2Hash } from "@node-rs/argon2";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: serverEnv.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const hashPassword = async (password: string) => {
  return await argon2Hash(password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });
};

const main = async () => {
  console.log("Starting database seeding...");

  try {
    const categories = [
      { name: "Nature", slug: "nature", description: "Natural landscapes and scenery" },
      { name: "Abstract", slug: "abstract", description: "Abstract and artistic wallpapers" },
      { name: "Technology", slug: "technology", description: "Tech and digital art" },
      { name: "Anime", slug: "anime", description: "Anime and manga-inspired wallpapers" },
      { name: "Cityscapes", slug: "cityscapes", description: "Urban and city landscapes" },
      { name: "Space", slug: "space", description: "Cosmos, galaxies, and astronomy" },
      { name: "Patterns", slug: "patterns", description: "Geometric and repeating patterns" },
      { name: "Minimal", slug: "minimal", description: "Clean and minimal designs" },
    ];

    const tags = [
      { name: "Minimalist", slug: "minimalist" },
      { name: "Dark", slug: "dark" },
      { name: "4K", slug: "4k" },
      { name: "Vibrant", slug: "vibrant" },
      { name: "Gradient", slug: "gradient" },
      { name: "Retro", slug: "retro" },
      { name: "Cyberpunk", slug: "cyberpunk" },
      { name: "Fantasy", slug: "fantasy" },
    ];

    const createdCategories = await Promise.all(
      categories.map((cat) =>
        prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        })
      )
    );

    const createdTags = await Promise.all(
      tags.map((tag) =>
        prisma.tag.upsert({
          where: { slug: tag.slug },
          update: {},
          create: tag,
        })
      )
    );

    console.log(`Seeded ${createdCategories.length} categories and ${createdTags.length} tags`);

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

    console.log(`Seeded admin user: ${adminUser.email}`);

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

    console.log(`Seeded demo user: ${demoUser.email}`);

    const categoryMap = Object.fromEntries(
      createdCategories.map((c) => [c.slug, c.id])
    );
    const tagMap = Object.fromEntries(
      createdTags.map((t) => [t.slug, t.id])
    );

    const sampleWallpapers = [
      {
        title: "Mountain Sunrise",
        slug: "nature",
        description: "Golden sunrise over misty mountain peaks",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["minimalist", "vibrant"],
      },
      {
        title: "Dark Forest",
        slug: "nature",
        description: "Mysterious foggy forest at dawn",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920",
        width: 1920,
        height: 1280,
        format: "jpg",
        tags: ["dark", "minimalist"],
      },
      {
        title: "Neon City",
        slug: "technology",
        description: "Cyberpunk cityscape with neon lights",
        imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["cyberpunk", "vibrant", "dark"],
      },
      {
        title: "Abstract Waves",
        slug: "abstract",
        description: "Fluid abstract wave patterns",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["vibrant", "gradient"],
      },
      {
        title: "Anime Sunset",
        slug: "anime",
        description: "Dreamy anime-style sunset scene",
        imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["vibrant", "fantasy"],
      },
      {
        title: "Milky Way",
        slug: "space",
        description: "Milky Way galaxy stretching across the night sky",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["dark", "4k"],
      },
      {
        title: "Geometric Patterns",
        slug: "patterns",
        description: "Symmetrical geometric design",
        imageUrl: "https://images.unsplash.com/photo-1558591710-4b5a4aead266?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["minimalist", "gradient"],
      },
      {
        title: "Urban Night",
        slug: "cityscapes",
        description: "City lights reflecting off wet streets",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["cyberpunk", "dark"],
      },
      {
        title: "Retro Wave",
        slug: "abstract",
        description: "Synthwave-inspired retro design",
        imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["retro", "vibrant", "gradient"],
      },
      {
        title: "Minimal Geometry",
        slug: "minimal",
        description: "Clean geometric shapes on a solid background",
        imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920",
        width: 1920,
        height: 1080,
        format: "jpg",
        tags: ["minimalist", "gradient"],
      },
    ];

    // Delete only seeded fixture data for idempotent re-runs
    const seededImageUrls = sampleWallpapers.map((wp) => wp.imageUrl);

    await prisma.like.deleteMany({
      where: { wallpaper: { imageUrl: { in: seededImageUrls } } },
    });
    await prisma.download.deleteMany({
      where: { wallpaper: { imageUrl: { in: seededImageUrls } } },
    });
    await prisma.collectionItem.deleteMany({
      where: { wallpaper: { imageUrl: { in: seededImageUrls } } },
    });
    await prisma.wallpaper.deleteMany({
      where: { userId: adminUser.id, imageUrl: { in: seededImageUrls } },
    });

    console.log("Cleaned existing demo data");

    const createdWallpapers = [];
    for (const wp of sampleWallpapers) {
      const wallpaper = await prisma.wallpaper.create({
        data: {
          title: wp.title,
          description: wp.description,
          imageUrl: wp.imageUrl,
          thumbnailUrl: wp.imageUrl.replace("w=1920", "w=480"),
          width: wp.width,
          height: wp.height,
          format: wp.format,
          fileSize: Math.floor(Math.random() * 5000000) + 500000,
          isPublic: true,
          isFeatured: Math.random() > 0.7,
          downloadCount: Math.floor(Math.random() * 1000),
          viewCount: Math.floor(Math.random() * 10000),
          categoryId: categoryMap[wp.slug],
          userId: adminUser.id,
          tags: {
            create: wp.tags
              .filter((t) => tagMap[t])
              .map((t) => ({ tagId: tagMap[t] })),
          },
        },
      });
      createdWallpapers.push(wallpaper);
    }

    console.log(`Seeded ${createdWallpapers.length} wallpapers`);

    const collection = await prisma.collection.upsert({
      where: { id: "demo-collection" },
      update: {},
      create: {
        id: "demo-collection",
        name: "Favorites",
        description: "My favorite wallpapers",
        isPublic: true,
        userId: demoUser.id,
      },
    });

    await prisma.collectionItem.createMany({
      data: [
        { collectionId: collection.id, wallpaperId: createdWallpapers[0].id },
        { collectionId: collection.id, wallpaperId: createdWallpapers[4].id },
        { collectionId: collection.id, wallpaperId: createdWallpapers[5].id },
      ],
    });

    console.log(`Seeded collection: ${collection.name}`);

    for (const wp of createdWallpapers.slice(0, 5)) {
      await prisma.like.upsert({
        where: {
          userId_wallpaperId: { userId: demoUser.id, wallpaperId: wp.id },
        },
        update: {},
        create: { userId: demoUser.id, wallpaperId: wp.id },
      });
    }

    console.log("Seeded likes for demo user");

    for (const wp of createdWallpapers.slice(0, 3)) {
      await prisma.download.create({
        data: {
          userId: demoUser.id,
          wallpaperId: wp.id,
        },
      });
    }

    console.log("Seeded downloads for demo user");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
    console.log("Disconnected successfully");
  }
};

main().catch((e) => {
  console.error("Fatal error during seeding:", e);
  process.exit(1);
});
