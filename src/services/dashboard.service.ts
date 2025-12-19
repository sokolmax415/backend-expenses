import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    const  newCategories = 0
    const [
        totalUsers,
        totalExpenses,
        totalCategories,
        expensesAgg,
        recentExpenses,
        newUsers,
        newExpenses,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.expense.count(),
        prisma.category.count(),

        prisma.expense.aggregate({
        _sum: { amount: true },
        _avg: { amount: true },
        }),

        prisma.expense.findMany({
        take: 10,
        orderBy: { date: "desc" },
        include: {
            category: { select: { name: true } },
            user: { select: { email: true } },
        },
        }),

        prisma.user.count({
        where: { createdAt: { gte: monthAgo } },
        }),

        prisma.expense.count({
        where: { createdAt: { gte: monthAgo } },
        }),

    ]);

    const byCategory = await prisma.expense.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        _count: { _all: true },
    });

    const categories = await prisma.category.findMany({
        where: { id: { in: byCategory.map(c => c.categoryId) } },
    });

    const categoryMap = Object.fromEntries(
        categories.map(c => [c.id, c.name])
    );

    return {
        totalUsers,
        totalExpenses,
        totalCategories,
        totalAmount: expensesAgg._sum.amount ?? 0,
        realAvgReceipt: expensesAgg._avg.amount ?? 0,
        recentExpenses,
        newUsers,
        newExpenses,
        newCategories,
        avgReceiptChange: "0%",
        byCategory: byCategory.map(c => ({
        name: categoryMap[c.categoryId],
        total: c._sum.amount ?? 0,
        count: c._count._all,
        })),
    };
}
