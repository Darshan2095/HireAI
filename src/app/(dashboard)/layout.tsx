import { auth } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";
import { Sidebar } from "@/components/shared/sidebar";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* 1. Fixed Navbar at the Top */}
      <header className="z-50 h-16 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Desktop Sidebar - Fixed Width, Hidden on Mobile if you haven't handled it */}
        <aside className="hidden md:flex w-72 flex-col border-r border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <Sidebar />
        </aside>

        {/* 3. Main Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {/* Subtle Background Glow for Depth */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute top-[40%] right-[5%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
          </div>

          {/* Content Wrapper with consistent padding */}
          <div className="h-full w-full max-w-7xl mx-auto px-4 py-8 md:px-8 lg:px-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
             {children}
          </div>

          {/* Footer or Copyright (Optional) */}
          <footer className="py-6 px-8 border-t border-border/20 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              HireAI © 2026 • Intelligent Career Management
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}