import { requireAdmin } from "@/lib/auth";
import {
  getAllCategories,
  createCategory,
} from "@/services/category.service";

import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const updateCategorySchema =
  createCategorySchema.partial();


export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const categories = await getAllCategories();
  return Response.json(categories, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }});
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation error" },
      { status: 400 ,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      } }
    );
  }

  try {
    const category = await createCategory(parsed.data);
    return Response.json(category, { status: 201,headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      } });
  } catch (e) {
    return Response.json(
      { error: "Category already exists" },
      { status: 409,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  }
    );
  }
}