import { getExpenses, createExpense } from "@/services/expenses.service";
import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number(),
  categoryId: z.string(),
  description: z.string(),
  date: z.coerce.date().optional(),
});

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")!;
  console.log("User-id",userId)

  const expenses = await getExpenses(userId);
  return Response.json(expenses, {
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  });
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")!;
  const body = await req.json();

  const result = createExpenseSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "Validation error" },
      { status: 400,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  }
    );
  }

  const expense = await createExpense(userId, result.data);
  return Response.json(expense, { status: 201,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  });
}
