import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const requestedResumeId =
        typeof body.resumeId === "string" && body.resumeId.trim().length > 0
            ? body.resumeId.trim()
            : null;

    if (!title || !company || !description) {
        return new Response("Title, company and description are required", {
            status: 400,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        select: {
            id: true,
        },
    });

    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    let resumeId = requestedResumeId;

    if (resumeId) {
        const resumeExists = await prisma.resume.findUnique({
            where: {
                id: resumeId,
            },
            select: {
                id: true,
            },
        });

        if (!resumeExists) {
            return new Response("Invalid resumeId", { status: 400 });
        }
    } else {
        const latestResume = await prisma.resume.findFirst({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
            },
        });

        if (!latestResume) {
            return new Response(
                "No resume found. Upload a resume first or provide resumeId.",
                { status: 400 },
            );
        }

        resumeId = latestResume.id;
    }

    await prisma.job.create({
        data: {
            title,
            company,
            description,
            matchScore: 100,
            resumeId,
        },
    });

    return Response.json({ success: true });
}