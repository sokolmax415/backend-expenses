

export function requireAdmin(req: Request) {
  const userId = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role");

  if (!userId) {
    return {
      error: Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (role !== "admin") {
    return {
      error: Response.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { userId };
}