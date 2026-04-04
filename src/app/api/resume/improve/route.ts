import { prisma } from "@/database/prisma";
import { improveResume } from "@/lib/resume-improver";
import { extractTextFromPDF } from "@/lib/pdf-extract";

export async function POST(req: Request) {
  const body = await req.json();

  const resume = await prisma.resume.findUnique({
    where: {
      id: body.resumeId,
    },
  });

  if (!resume) {
    return new Response("Resume not found");
  }

  const response = await fetch(resume.fileUrl);
  const buffer = await response.arrayBuffer();

  const text = await extractTextFromPDF(Buffer.from(buffer));

  const result = await improveResume(text);

  await prisma.resume.update({
    where: {
      id: resume.id,
    },
    data: {
      improvements: result.improvements,
      keywords: result.keywords,
      optimized: result.optimized,
    },
  });

  return Response.json({ success: true });
}