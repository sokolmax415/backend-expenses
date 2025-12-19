import {
  updateExpense,
  deleteExpense,
} from "@/services/expenses.service";
import {createExpenseSchema} from "@/app/api/expenses/route"

const updateExpenseSchema = createExpenseSchema.partial();
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const userId = req.headers.get("x-user-id")!;
    const { id } = await params;
    console.log("User-id",userId)
    console.log("URL:", req.url);
        console.log("params:", params);
    console.log("Expense-id",id)
    const body = await req.json();

    const result = updateExpenseSchema.safeParse(body);

    if (!result.success) {
        return Response.json(
        { error: "Validation error" },
        { status: 400,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  }
        );
    }

    try {
        const expense = await updateExpense(
        id,
        userId,
        result.data
        );
        return Response.json(expense, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  });
    } catch (e) {
        if ((e as Error).message === "NOT_FOUND") {
        return Response.json(
            { error: "Expense not found" },
            { status: 404,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  }
        );
        }
        throw e;
    }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const userId = req.headers.get("x-user-id")!;

    try {
        await deleteExpense(id, userId);
        return new Response(null, { status: 200,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  });
    } catch (e) {
        if ((e as Error).message === "NOT_FOUND") {
        return Response.json(
            { error: "Expense not found" },
            { status: 404 ,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      } }
        );
        }
        throw e;
    }
    }
