import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/services/dashboard.service";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const stats = await getDashboardStats();
  return Response.json(stats, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      } });
}