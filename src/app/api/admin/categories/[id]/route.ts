import { requireAdmin } from "@/lib/auth";
import {
  updateCategory,
  deleteCategory,
} from "@/services/category.service";
import { updateCategorySchema } from "../route";

export async function PUT(
  req: Request,
   { params }: { params: Promise<{ id: string }> }

) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = updateCategorySchema.safeParse(body);

  if (!parsed.success || Object.keys(parsed.data).length === 0) {
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

  try {
    const {id} = await params
    const category = await updateCategory(
      id,
      parsed.data
    );
    return Response.json(category);
  } catch (e) {
    if ((e as Error).message === "NOT_FOUND") {
      return Response.json(
        { error: "Category not found" },
        { status: 404,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    try {
        const {id} = await params
        await deleteCategory(id);
        return new Response(null, { status: 200 });
    } catch (e) {
        if ((e as Error).message === "NOT_FOUND") {
        return Response.json(
            { error: "Category not found" },
            { status: 404,
            headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }  }
        );
        }
        throw e;
    }
}
