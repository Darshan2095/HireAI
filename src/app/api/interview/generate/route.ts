import { prisma } from "@/database/prisma";
import { generateQuestions } from "@/lib/interview-generator";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response("Unauthorized");
  }

  const body = await req.json();

  const questions = await generateQuestions(body.skills);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  for (const q of questions) {
    await prisma.interview.create({
      data: {
        question: q.question,
        userId: user!.id,
      },
    });
  }

  return Response.json({ success: true });
}