import { prisma } from "@/database/prisma";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const title =
      typeof (body as { title?: unknown })?.title === "string"
        ? (body as { title: string }).title.trim()
        : "";
    const company =
      typeof (body as { company?: unknown })?.company === "string"
        ? (body as { company: string }).company.trim()
        : "";
    const description =
      typeof (body as { description?: unknown })?.description === "string"
        ? (body as { description: string }).description.trim()
        : "";
    const resumeId =
      typeof (body as { resumeId?: unknown })?.resumeId === "string"
        ? (body as { resumeId: string }).resumeId.trim()
        : "";

    if (!title || !company || !description) {
      return new Response("Missing fields", { status: 400 });
    }

    let resolvedResumeId = resumeId;

    if (resolvedResumeId) {
      const resumeExists = await prisma.resume.findUnique({
        where: { id: resolvedResumeId },
        select: { id: true },
      });

      if (!resumeExists) {
        return new Response("Invalid resumeId", { status: 400 });
      }
    } else {
      const latestResume = await prisma.resume.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (!latestResume) {
        return new Response("No resume found", { status: 400 });
      }

      resolvedResumeId = latestResume.id;
    }

    await prisma.job.create({
      data: {
        title,
        company,
        description,
        resumeId: resolvedResumeId,
      },
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return new Response("Error creating job", { status: 500 });
  }
}