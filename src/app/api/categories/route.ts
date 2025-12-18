import { NextResponse } from "next/server";
import { getAll } from "@/services/category.service";

export async function GET() {
  try {
    const categories = await getAll();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
