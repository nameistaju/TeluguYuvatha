import { PrismaClient } from "@prisma/client";
import { seedCategories, seedCollections, seedProducts, seedSettings } from "@telugu-yuvatha/shared";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await Promise.all(seedCategories.map((category) => prisma.category.upsert({ where: { id: category.id }, update: {}, create: category })));
  await Promise.all(seedCollections.map((collection) => prisma.collection.upsert({ where: { id: collection.id }, update: {}, create: collection })));
  await Promise.all(seedProducts.map((product) => prisma.product.upsert({ where: { id: product.id }, update: {}, create: product })));
  await Promise.all(seedSettings.map((setting) => prisma.siteSetting.upsert({ where: { key: setting.key }, update: {}, create: setting })));

  // Seed default admin account
  const adminEmail = "admin@teluguyuvatha.com";
  const passwordHash = await bcrypt.hash("adminpassword123", 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: "usr_admin",
      name: "System Admin",
      email: adminEmail,
      role: "admin",
      passwordHash
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
