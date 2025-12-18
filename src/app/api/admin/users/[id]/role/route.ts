import { requireAdmin } from "@/lib/auth";
import { updateUserRole } from "@/services/user.service";
import { updateRoleSchema } from "../../route";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = updateRoleSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation error" },
      { status: 400 }
    );
  }

  const {id} = await params
  const user = await updateUserRole(id, parsed.data.role);
  return Response.json(user);
}
