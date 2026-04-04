import { prisma } from "@/database/prisma";
import { matchJobs } from "@/lib/job-matcher";

export async function POST(req: Request) {
    const body = await req.json();

    const resume = await prisma.resume.findUnique({
        where: {
            id: body.resumeId,
        },
    });

    if (!resume?.skills) {
        return new Response("No skills found", { status: 400 });
    }

    const jobs = await matchJobs(resume.skills);

    for (const job of jobs) {
        await prisma.job.create({
            data: {
                title: job.title,
                company: job.company,
                description: job.description,
                matchScore: job.matchScore,
                resumeId: resume.id,
            },
        });
    }

    return Response.json({ success: true });
}