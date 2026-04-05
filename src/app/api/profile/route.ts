import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, username } = body;

    // 2. Optional: Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.email !== session.user.email) {
        return Response.json(
          { error: "Username already taken" }, 
          { status: 400 }
        );
      }
    }

    // 3. Update Database
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: name,
        username: username?.toLowerCase().trim(), // Clean the data before saving
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new Response("Internal Error", { status: 500 });
  }
}