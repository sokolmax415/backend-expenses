import { requireAdmin } from "@/lib/auth";
import { deleteUser, getUserById} from "@/services/user.service";

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const {id} = await params

  const user = await getUserById(id);

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return Response.json(user);
}