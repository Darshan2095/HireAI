import { prisma } from "@/database/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    // find company
    const company = await prisma.company.findUnique({
      where: { email },
    });

    if (!company || !company.password) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // compare password
    const isValid = await bcrypt.compare(
      password,
      company.password
    );

    if (!isValid) {
      return new Response("Invalid credentials", { status: 401 });
    }

    return Response.json({
      success: true,
      companyId: company.id,
    });

  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}