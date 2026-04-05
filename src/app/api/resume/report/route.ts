import { prisma } from "@/database/prisma";
import { generateResumePDF } from "@/lib/resume-report";

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

  const pdf = await generateResumePDF(resume);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume-report.pdf",
    },
  });
}