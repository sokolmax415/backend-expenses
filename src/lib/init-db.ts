import "dotenv/config";
import { prisma} from "@/lib/prisma"

export async function initDatabase() {
  console.log("🔍 Initializing database...");
  
  try {
    // 1. Проверяем, нужно ли создавать данные
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();
    
    if (categoryCount > 0 && userCount > 0) {
      console.log(`Database already initialized (${categoryCount} categories, ${userCount} users)`);
      return;
    }
    
    console.log("Creating initial data...");
    
    // 2. Создаем админа (если нет)
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@test.com" }
    });
    
    if (!adminExists) {
      const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
          email: "admin@test.com",
          name: "Администратор",
          // пароль: admin
          passwordHash: "$2a$10$M7fQlBL63FdXNl2AVd.73.7eXKgtU89Qgiyh0ftjk4NZMvQGAaMaW",
          role: "admin",
        },
      });
      console.log(`Admin user: ${admin.email} (password: admin123)`);
    } else {
      console.log(`Admin user already exists: ${adminExists.email}`);
    }
    
    if (categoryCount === 0) {
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
      console.log("6 categories created");
    }
    

    const testUserExists = await prisma.user.findUnique({
      where: { email: "user@test.com" }
    });
    
    if (!testUserExists) {
      const testUser = await prisma.user.create({
        data: {
          email: "user@test.com",
          name: "Тестовый Пользователь",
          // Пароль: user123
          passwordHash: "$2a$10$i6JNvC3QJQnE1q9oK3Xz.uY8V8V5iR5nX8L9aN0bG7vK5L3M6N7oP8q",
          role: "client",
        },
      });
      console.log(`Test user: ${testUser.email} (password: user123)`);
    }
    
    console.log("Database initialization complete!");
    
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}


export default initDatabase;