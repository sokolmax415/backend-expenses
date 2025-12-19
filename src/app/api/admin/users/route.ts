import { requireAdmin } from "@/lib/auth";
import { getAllUsers, createUser } from "@/services/user.service";
import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(6),
    role: z.string().optional(),
}).strict();

export const updateRoleSchema = z.object({
    role: z.string().min(1),
}).strict();


export async function GET(req: Request) {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const users = await getAllUsers();
    return Response.json(users);
}

export async function POST(req: Request) {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json(
        { error: "Validation error" },
        { status: 400,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  }
        );
    }

    try {
        const user = await createUser(parsed.data);
        return Response.json(user, { status: 201,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }  });
    } catch (e) {
        if ((e as Error).message === "USER_EXISTS") {
        return Response.json(
            { error: "User already exists" },
            { status: 409 ,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      } }
        );
        }
        throw e;
    }
}
