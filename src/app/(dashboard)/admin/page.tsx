import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/dashboard");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="p-6 rounded border space-y-2">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
                Job posting is available only in the company dashboard.
            </p>
        </div>
    );
}