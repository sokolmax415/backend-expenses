import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export const runtime = 'nodejs';
export async function middleware(req: NextRequest) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

  const pathname = req.nextUrl.pathname;
  
    // Проверяем, нужна ли авторизация для этого пути
    const needsAuth = 
      pathname.startsWith("/api/expenses") || 
      pathname.startsWith("/api/categories") ||
      pathname.startsWith("/api/users/me") ||
      pathname.startsWith("/api/admin/users") ||
      pathname.startsWith("/api/admin/categories")  ||
      pathname.startsWith("/api/admin/dashboard") ||
      pathname.startsWith("/api/admin/reports") 
    
    if (!needsAuth) {
      return NextResponse.next();
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } }
      );
    }

    const token = authHeader.slice(7);
    console.log("Token:",token)
    try {
      const payload = verifyAccessToken(token);
      console.log("payload",payload)
      // Прокидываем userId в заголовках
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", String(payload.sub));
      
      if (payload.role) {
        requestHeaders.set("x-user-role", payload.role);
      }

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } }
      );
    }
}

export const config = {
  matcher: ["/api/expenses/:path*", "/api/categories/:path*","/api/users/me","/api/admin/users/:path*","/api/auth/:path*","/api/admin/categories/:path*","/api/admin/dashboard","/api/admin/reports"],
};