import { prisma } from "@/database/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.resume.delete({
    where: {
      id: body.id,
    },
  });

  return Response.json({ success: true });
}