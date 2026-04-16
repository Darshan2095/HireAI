import { prisma } from "@/database/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    // check if company exists
    const existing = await prisma.company.findUnique({
      where: { email },
    });

    if (existing) {
      return new Response("Company already exists", { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create company
    await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}