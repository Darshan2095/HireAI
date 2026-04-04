"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  User,
  ChevronRight,
  ClipboardCheck,
  PlusSquare,
  Sparkles
} from "lucide-react";

const routes = [
  // --- MAIN SECTION ---
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-slate-500",
  },
  // --- CAREER TOOLS ---
  {
    label: "Resume",
    icon: FileText,
    href: "/resume",
    color: "text-purple-500",
  },
  {
    label: "Jobs",
    icon: Briefcase,
    href: "/jobs",
    color: "text-emerald-500",
  },
  {
    label: "Applications",
    icon: ClipboardCheck,
    href: "/applications",
    color: "text-orange-500",
  },
  {
    label: "Interview",
    icon: MessageSquare,
    href: "/interview",
    color: "text-pink-500",
    isNew: true, // Let's highlight this as a new feature!
  },
  // --- ADMIN TOOLS ---
  {
    label: "Post a Job",
    icon: PlusSquare,
    href: "/admin/jobs",
    color: "text-red-500",
    isAdmin: true,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r transition-all duration-300 w-64 shadow-sm">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <span>Hire<span className="text-primary">AI</span></span>
        </div>
      </div>

      <div className="px-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center justify-between p-3 w-full font-bold cursor-pointer rounded-xl transition-all duration-300 mb-1.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  route.isAdmin && "mt-6 border-t border-border/40 pt-6 rounded-none" // Visual break for Admin
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : route.color
                  )} />
                  <span className="text-sm tracking-tight">
                    {route.label}
                  </span>
                </div>

                {route.isNew && !isActive && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-tighter">
                    New
                  </span>
                )}
                
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile/Pro Upgrade Footer */}
      <div className="p-4">
        <div className="p-5 rounded-[24px] bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/10 relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Status</p>
          <p className="text-xs font-bold text-foreground">6th Sem Student</p>
          <p className="text-[11px] text-muted-foreground mt-1 leading-tight opacity-70">
            Keep applying to reach your 7th sem goal.
          </p>
        </div>
      </div>
    </div>
  );
};