import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return new Response(
      JSON.stringify({ error: "Refresh token required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const newPayload = {
      sub: payload.sub,
      role: payload.role,
    };

    return Response.json({
      accessToken: generateAccessToken(newPayload)
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid or expired refresh token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
