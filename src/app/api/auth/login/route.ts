import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: "Validation error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 }
    );
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isValidPassword) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 }
    );
  }

  const payload = {
    sub: user.id,
    role: user.role,
  };

  return Response.json({
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  });
}
