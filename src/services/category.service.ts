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


export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: {
  name: string;
  description: string;
}) {
  return prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; description: string }>
) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("NOT_FOUND");
  }

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("NOT_FOUND");
  }

  return prisma.category.delete({
    where: { id },
  });
}


