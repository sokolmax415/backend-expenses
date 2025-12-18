import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("🌱 Seeding DB:", process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Admin",
      passwordHash: "$2a$10$M7fQlBL63FdXNl2AVd.73.7eXKgtU89Qgiyh0ftjk4NZMvQGAaMaW",
      role: "admin",
    },
  });

  console.log("Admin:", admin.email);

  await prisma.category.createMany({
    data: [
      { name: "Еда", description: "Продукты питания, рестораны" },
      { name: "Транспорт", description: "Бензин, такси, общественный транспорт" },
      { name: "Развлечения", description: "Кино, концерты, хобби" },
      { name: "Жилье", description: "Аренда, коммунальные услуги" },
      { name: "Здоровье", description: "Лекарства, врачи" },
      { name: "Прочее", description: "Другие расходы" }
    ],
    skipDuplicates: true,
  });

  console.log("Categories seeded");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
