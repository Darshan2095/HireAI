"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  PlusCircle, 
  Settings2, 
  Building2,
  ChevronRight,
  Menu
} from "lucide-react";

const navItems = [
  { 
    href: "/company/dashboard", 
    label: "Overview", 
    icon: LayoutGrid,
    color: "text-blue-500" 
  },
  { 
    href: "/company/dashboard/post-job", 
    label: "Post Job", 
    icon: PlusCircle,
    color: "text-emerald-500" 
  },
  { 
    href: "/company/dashboard/manage-jobs", 
    label: "Manage Jobs", 
    icon: Settings2,
    color: "text-purple-500" 
  },
];

export default function CompanyDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="max-w-[1400px] mx-auto py-6 md:py-10 px-4 md:px-8">
        
        {/* Header Section for Mobile/Desktop */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recruiter Hub</h1>
              <p className="text-sm text-slate-500">Manage your company&apos;s hiring pipeline</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          {/* Sidebar - Hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <div className="px-3 mb-4">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Menu
                </h2>
              </div>
              
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                        isActive 
                          ? "bg-white text-primary shadow-sm border border-slate-200/60 scale-[1.02]" 
                          : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        )} />
                        {item.label}
                      </div>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Help/Support Card */}
              <div className="mt-10 p-6 rounded-[24px] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Support</p>
                  <p className="text-sm font-medium leading-relaxed">Need help with posting? Our team is here.</p>
                  <button className="mt-4 text-xs font-bold py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
                    Contact Sales
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 h-20 w-20 bg-primary/20 rounded-full blur-2xl" />
              </div>
            </div>
          </aside>

          {/* Mobile Horizontal Navigation */}
          <nav className="lg:hidden flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white border border-slate-200 text-slate-600"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className={cn(
            "min-h-[600px] rounded-[32px] bg-white border border-slate-200/60 shadow-sm p-6 md:p-10",
            "animate-in fade-in slide-in-from-bottom-4 duration-700"
          )}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}