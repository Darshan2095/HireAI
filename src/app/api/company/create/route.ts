import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) return new Response("Missing name", { status: 400 });

    const existing = await prisma.company.findFirst({ where: { name } });
    if (existing) return new Response("Company name already taken", { status: 400 });

    const created = await prisma.company.create({
      data: { name, email: session.user.email! },
    });

    return new Response(JSON.stringify({ success: true, id: created.id }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
