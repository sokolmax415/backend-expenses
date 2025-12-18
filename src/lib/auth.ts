import { verifyAccessToken } from "@/lib/jwt";

export function getAuthUser(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload.sub) {
    throw new Error("INVALID_TOKEN");
  }

  return {
    userId: String(payload.sub),
    role: payload.role as string | undefined,
  };
}
