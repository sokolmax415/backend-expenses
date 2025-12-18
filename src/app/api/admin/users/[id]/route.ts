import { requireAdmin } from "@/lib/auth";
import { deleteUser } from "@/services/user.service";

export async function DELETE(
  req: Request,
 { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const {id} = await params

  await deleteUser(id);
  return new Response(null, { status: 200 });
}
