import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import { AddJob } from "@/features/admin/components/add-job";

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
        <div>
            <h1 className="text-2xl font-bold">
                Admin Panel
            </h1>

            <p>Add Jobs for Users</p>
            <AddJob />
        </div>
    );
}