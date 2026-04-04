import { prisma } from "@/database/prisma";
import { evaluateAnswer } from "@/lib/interview-evaluator";

export async function POST(req: Request) {
  const body = await req.json();

  const interview = await prisma.interview.findUnique({
    where: {
      id: body.id,
    },
  });

  const result = await evaluateAnswer(
    interview!.question,
    body.answer
  );

  await prisma.interview.update({
    where: {
      id: body.id,
    },
    data: {
      answer: body.answer,
      score: result.score,
      feedback: result.feedback,
    },
  });

  return Response.json({ success: true });
}