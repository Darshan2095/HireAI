import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Briefcase, Shield, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function LoginSelectPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] relative flex items-center justify-center p-6 overflow-hidden">
            {/* Soft Ambient Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Sparkles className="h-3 w-3" /> Secure Gateway
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight italic">
                        Hire<span className="text-primary not-italic">AI</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto font-medium leading-relaxed">
                        The future of recruitment is here. Select your portal to begin your journey.
                    </p>
                </div>

                {/* Role Selection Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <LoginCard
                        title="Student"
                        description="Access AI-driven job matches and build your career profile."
                        icon={<Users className="w-8 h-8" />}
                        href="/login"
                        colorClass="text-blue-600 bg-blue-50"
                        hoverBorder="hover:border-blue-200"
                    />

                    <LoginCard
                        title="Company"
                        description="Post listings and let our AI rank the top talent for you."
                        icon={<Briefcase className="w-8 h-8" />}
                        href="/company/login"
                        colorClass="text-emerald-600 bg-emerald-50"
                        hoverBorder="hover:border-emerald-200"
                    />

                    <LoginCard
                        title="Admin"
                        description="Oversee the ecosystem, manage users, and view analytics."
                        icon={<Shield className="w-8 h-8" />}
                        href="/admin/login"
                        colorClass="text-purple-600 bg-purple-50"
                        hoverBorder="hover:border-purple-200"
                    />
                </div>

                {/* Footer Signup */}
                <div className="mt-16 text-center space-y-6">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto" />
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                        Looking to hire talent? 
                        <Link href="/company/signup" className="text-primary hover:underline ml-2 underline-offset-4 decoration-2">
                            Create a Company Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

interface LoginCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    colorClass: string;
    hoverBorder: string;
}

function LoginCard({ title, description, icon, href, colorClass, hoverBorder }: LoginCardProps) {
    return (
        <Link href={href} className="group">
            <div className={cn(
                "relative h-full bg-white border border-slate-200/60 rounded-[32px] p-8",
                "transition-all duration-500 hover:-translate-y-2",
                "flex flex-col items-start text-left shadow-sm hover:shadow-xl hover:shadow-primary/5",
                hoverBorder
            )}>
                {/* Visual Icon Container */}
                <div className={cn(
                    "mb-10 p-5 rounded-[24px] transition-all duration-500",
                    "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/10",
                    colorClass
                )}>
                    {icon}
                </div>

                <div className="flex-grow space-y-3">
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors italic">
                        {title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {/* Action Indicator */}
                <div className="mt-8 w-full flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">
                        Enter Portal
                    </span>
                    <div className="h-10 w-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:w-20">
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}