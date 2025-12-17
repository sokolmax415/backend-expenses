import { z } from "zod";
import { registerUser } from "@/services/auth.service";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation error" },
      { status: 400 }
    );
  }

  try {
    const tokens = await registerUser(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    );

    return Response.json(tokens);
  } catch (e) {
    if ((e as Error).message === "USER_EXISTS") {
      return Response.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    throw e;
  }
}
