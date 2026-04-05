import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";

export const currentUser = async () => {
  const session = await auth();
  
  if (!session?.user?.email) {
    return session?.user;
  }

  // Fetch full user data including username from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      username: true,
    },
  });

  return user || session?.user;
};