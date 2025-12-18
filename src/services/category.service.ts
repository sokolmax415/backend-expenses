import { prisma } from "@/lib/prisma";
import { CategoryDTO } from "@/types/categories";


export async function getAll(): Promise<CategoryDTO[]> {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });
}



