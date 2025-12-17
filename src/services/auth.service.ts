import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";
import { JwtPayload } from "@/types/auth";

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  return generateTokens(user.id, user.role);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return generateTokens(user.id, user.role);
}

export function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  return generateTokens(payload.sub, payload.role);
}

function generateTokens(userId: string, role: string) {
  const payload: JwtPayload = {
    sub: userId,
    role: role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
