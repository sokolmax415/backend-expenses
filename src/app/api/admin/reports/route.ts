import { requireAdmin } from "@/lib/auth";
import { getReports } from "@/services/reports.service";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const report = await getReports();
  return Response.json(report, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      } });
}