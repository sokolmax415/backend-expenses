import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { z } from "zod";


const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: "Validation error"}),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const { email, password, name } = result.data as {
  email: string;
  password: string;
  name: string;};

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "User already exists" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name
    },
  });

  const payload = { sub: user.id, role: user.role };

  return Response.json({
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  });
}
