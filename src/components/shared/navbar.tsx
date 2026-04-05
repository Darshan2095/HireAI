import { currentUser } from "@/lib/current-user";
import { UserProfile } from "./user-profile";
import Link from "next/link";
import { Sparkles } from "lucide-react";


export const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo Section */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            HireAI
          </h1>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Subtle Indicator for AI Status or Plan */}
          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-secondary/50 border border-border text-[12px] font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            AI Engine Active
          </div>

          <div className="pl-2 border-l border-border h-6 hidden sm:block" />

          <UserProfile 
            name={user?.name} 
            image={user?.image}
            username={user?.username}
          />
        </div>
      </div>
    </nav>
  );
};