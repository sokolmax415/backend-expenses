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
  return Response.json({ success: true, message: "User deleted successfully" }, { status: 200,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      } });
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
      { status: 404,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      } }
    );
  }

  return Response.json(user, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      } });
}