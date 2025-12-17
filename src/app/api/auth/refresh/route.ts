import { z } from "zod";
import { refreshTokens } from "@/services/auth.service";

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = refreshSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Refresh token required" },
      { status: 400 }
    );
  }

  try {
    const tokens = refreshTokens(parsed.data.refreshToken);
    return Response.json(tokens);
  } catch {
    return Response.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
