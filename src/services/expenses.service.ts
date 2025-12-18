import { prisma } from "@/lib/prisma";
import {CreateExpenseInput} from "@/types/expense"

export async function getExpenses(userId: string) {
  return prisma.expense.findMany({
    where: { userId },
    include: {
      category: true,
    },
    orderBy: { date: "desc" },
  });
}



export async function createExpense(
  userId: string,
  data: CreateExpenseInput
) {
  return prisma.expense.create({
    data: {
      amount: data.amount,
      description: data.description,
      date: data.date ?? new Date(),
      userId,
      categoryId: data.categoryId,
    },
  });
}

export async function updateExpense(
  id: string,
  userId: string,
  data: Partial<CreateExpenseInput>
) {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) {
    throw new Error("NOT_FOUND");
  }

  return prisma.expense.update({
    where: { id },
    data,
  });
}

export async function deleteExpense(id: string, userId: string) {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) {
    throw new Error("NOT_FOUND");
  }

  await prisma.expense.delete({ where: { id } });
}