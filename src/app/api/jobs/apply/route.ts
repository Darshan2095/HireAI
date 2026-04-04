import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    await prisma.application.create({
        data: {
            jobId: body.jobId,
            userId: user.id,
        },
    });

    return Response.json({ success: true });
}