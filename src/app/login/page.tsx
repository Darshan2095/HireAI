import { auth } from "@/lib/auth";
import { LoginButton } from "@/features/auth/components/login-button";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <LoginButton />
        </div>
    );
}