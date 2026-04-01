import { prisma } from "@/database/prisma";

export async function testDB() {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected:", result);
}