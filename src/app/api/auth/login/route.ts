import { z } from "zod";
import { loginUser } from "@/services/auth.service";
import {initDatabase} from "@/lib/init-db"

let initialized = false;

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  if (!initialized) {
    await initDatabase();
    initialized = true;
  }

  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation error" },
      { status: 400 }
    );
  }

  try {
    const tokens = await loginUser(
      parsed.data.email,
      parsed.data.password
    );

    return Response.json(tokens);
  } catch {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
}
