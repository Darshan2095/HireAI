import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name: body.name,
    },
  });

  return Response.json({ success: true });
}