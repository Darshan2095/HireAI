import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prismaClientSingleton = () => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    return new PrismaClient({
        adapter: new PrismaPg(pool),
        log: process.env.NODE_ENV === "development"
            ? ["warn", "error"]
            : ["error"],
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;