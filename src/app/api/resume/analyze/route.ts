import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { analyzeResume } from "@/lib/resume-analyzer";
import { extractTextFromPDF } from "@/lib/pdf-extract";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { resumeId } = body;

    if (!resumeId) {
      return new Response("Resume ID required", { status: 400 });
    }

    // Get resume
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume) {
      return new Response("Resume not found", { status: 404 });
    }

    // Fetch file
    const response = await fetch(resume.fileUrl);
    const buffer = await response.arrayBuffer();

    // Extract text from PDF
    const text = await extractTextFromPDF(Buffer.from(buffer));

    // Analyze using Gemini
    const result = await analyzeResume(text);

    // Save analysis
    // Prisma Client types in this repo currently don't expose these fields on
    // `ResumeUpdateInput` even though the DB/schema supports them.
    // Cast through the update call's data type to avoid `any` while keeping
    // this boundary explicit.
    const analysisData = {
      score: result.score,
      feedback: result.feedback,
      skills: result.skills,
      technologies: result.technologies,
      experience: result.experience,
      improvements: result.improvements,
      keywords: result.keywords,
      optimized: result.optimized,
    } as unknown as Parameters<typeof prisma.resume.update>[0]["data"];

    await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: analysisData,
    });

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error("Resume analysis error:", error);

    const message = error instanceof Error ? error.message : "Analysis failed";

    return Response.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}