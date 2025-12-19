import { prisma } from "@/lib/prisma";

export async function getReports() {
  const [totalAgg, usersCount] = await Promise.all([
    prisma.expense.aggregate({
      _sum: { amount: true },
    }),
    prisma.user.count(),
  ]);

  const byCategoryRaw = await prisma.expense.groupBy({
    by: ["categoryId"],
    _sum: { amount: true },
    _count: { _all: true },
  });

  const byUserRaw = await prisma.expense.groupBy({
    by: ["userId"],
    _sum: { amount: true },
    _count: { _all: true },
  });

  const categories = await prisma.category.findMany();
  const users = await prisma.user.findMany();

  const categoryMap = Object.fromEntries(
    categories.map(c => [c.id, c.name])
  );
  const userMap = Object.fromEntries(
    users.map(u => [u.id, u.email])
  );

  const recentExpenses = await prisma.expense.findMany({
    take: 10,
    orderBy: { date: "desc" },
    select: {
      id: true,
      amount: true,
      description: true,
      date: true,
    },
  });

  return {
    totalExpenses: totalAgg._sum.amount ?? 0,
    averagePerUser:
      usersCount === 0
        ? 0
        : (totalAgg._sum.amount ?? 0) / usersCount,

    byCategory: byCategoryRaw.map(c => ({
      name: categoryMap[c.categoryId],
      total: c._sum.amount ?? 0,
      count: c._count._all,
    })),

    byUser: byUserRaw.map(u => ({
      email: userMap[u.userId],
      total: u._sum.amount ?? 0,
      count: u._count._all,
    })),

    recentExpenses,
  };
}
