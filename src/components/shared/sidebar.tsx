"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Standard ShadCN utility
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  User,
  ChevronRight,
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
    color: "text-gray-500",
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
    isComingSoon: true,
  },
  {
    label: "Interview",
    icon: MessageSquare,
    href: "/interview",
    isComingSoon: true,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r transition-all duration-300 w-64">
      <div className="px-4 py-8 flex-1">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            
            return (
              <Link
                key={route.href}
                href={route.isComingSoon ? "#" : route.href}
                className={cn(
                  "group flex items-center justify-between p-3 w-full font-medium cursor-pointer rounded-xl transition-all duration-200 mb-1",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  route.isComingSoon && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    isActive ? "text-primary-foreground" : route.color
                  )} />
                  <span className="text-sm tracking-wide">
                    {route.label}
                  </span>
                </div>
                
                {route.isComingSoon ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider">
                    Soon
                  </span>
                ) : (
                  isActive && <ChevronRight className="h-4 w-4 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Optional: Simple Pro/Upgrade Badge at the bottom */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10">
        <p className="text-xs font-semibold text-foreground mb-1">HireAI Pro</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Unlock unlimited AI analysis and custom templates.
        </p>
      </div>
    </div>
  );
};