import { getMe, updateMe } from "@/services/user.service";

import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
}).strict();

export async function GET(req: Request) {
    const userId = req.headers.get("x-user-id")!;
    const user = await getMe(userId);

    if (!user) {
        return Response.json(
        { error: "User not found" },
        { status: 404 }
        );
    }

    return Response.json(user);
}

export async function PUT(req: Request) {


    const body = await req.json();
    const parsed = updateMeSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json(
        { error: "Validation error" },
        { status: 400 }
        );
    }

    if (Object.keys(parsed.data).length === 0) {
        return Response.json(
        { error: "Nothing to update" },
        { status: 400 }
        );
    }

    try {
        const userId = req.headers.get("x-user-id")!;
        const user = await updateMe(userId, parsed.data);
        return Response.json(user);
    } catch (e) {
        return Response.json(
        { error: "Update failed" },
        { status: 400 }
        );
    }
}
