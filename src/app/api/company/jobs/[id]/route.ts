import { prisma } from "@/database/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return new Response("Not found", { status: 404 });

    await prisma.job.delete({ where: { id } });
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : undefined;
    const description = typeof body?.description === "string" ? body.description.trim() : undefined;

    if (!title && !description) return new Response("Missing fields", { status: 400 });

    const job = await prisma.job.update({ where: { id }, data: { ...(title ? { title } : {}), ...(description ? { description } : {}) } });
    return new Response(JSON.stringify({ success: true, job }));
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(job));
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
