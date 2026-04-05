"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  User,
  ClipboardCheck,
  PlusSquare,
  Sparkles,
  MoreHorizontal,
  X,
  History,
  Settings,
  Bell
} from "lucide-react";

const routes = [
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
    isNew: true,
  },
  {
    label: "Post a Job",
    icon: PlusSquare,
    href: "/admin",
    color: "text-red-500",
    isAdmin: true,
  },
];

const isRouteActive = (pathname: string, href: string) => {
  if (pathname === href) return true;
  if (href === "/dashboard") return pathname.startsWith("/dashboard/");
  return pathname.startsWith(`${href}/`);
};

export const Sidebar = ({ mobile = false }: { mobile?: boolean }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (mobile) {
    // Priority routes for the quick-access dock
    const dockRoutes = routes.filter(r => ["Dashboard", "Resume", "Jobs", "Interview"].includes(r.label));
    const secondaryRoutes = routes.filter(r => !dockRoutes.includes(r) && !r.isAdmin);

    return (
      <>
        {/* Hub Overlay (Glassmorphism) */}
        <div className={cn(
          "fixed inset-0 z-[60] bg-background/80 backdrop-blur-xl transition-all duration-500 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "absolute bottom-24 left-6 right-6 p-6 bg-card border border-border/50 rounded-[32px] shadow-2xl transition-all duration-500 transform",
            isMenuOpen ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
          )}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">More Features</p>
            <div className="grid grid-cols-3 gap-6">
              {[...secondaryRoutes, 
                { label: "History", icon: History, href: "interview/history", color: "text-indigo-500" },
                { label: "Admin", icon: Settings, href: "/admin", color: "text-slate-400" }
              ].map((route) => (
                <Link 
                  key={route.href} 
                  href={route.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn("p-3 rounded-2xl bg-secondary/50 group-active:scale-90 transition-all")}>
                    <route.icon className={cn("h-6 w-6", route.color)} />
                  </div>
                  <span className="text-[10px] font-bold">{route.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Bottom Dock */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[70]">
          <div className="bg-card/90 backdrop-blur-lg border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] px-2 py-2 flex items-center justify-between">
            {dockRoutes.map((route) => {
              const active = isRouteActive(pathname, route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-12 w-12 rounded-xl transition-all duration-300",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {active && (
                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-foreground" />
                  )}
                  {route.isNew && !active && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Hub Trigger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500",
                isMenuOpen ? "bg-slate-900 text-white rotate-90" : "bg-secondary text-foreground"
              )}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </>
    );
  }

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
            const isActive = isRouteActive(pathname, route.href);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center justify-between p-3 w-full font-bold cursor-pointer rounded-xl transition-all duration-300 mb-1.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  route.isAdmin && "mt-6 border-t border-border/40 pt-6 rounded-none"
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

      {/* Profile/Student Footer */}
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