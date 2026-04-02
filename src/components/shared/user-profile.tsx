"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

interface UserProfileProps {
  name?: string | null;
  image?: string | null;
}

export const UserProfile = ({ name, image }: UserProfileProps) => {
  // Extract the first letter for a clean fallback avatar
  const initials = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      {/* 1. Enhanced Trigger Button */}
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-secondary/80 border border-transparent hover:border-border transition-all duration-200">
          
          {/* Avatar Container with light gradient fallback */}
          <div className="relative h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-blue-50 border border-border/50 shadow-sm">
            {image ? (
              <Image
                src={image}
                alt="user profile"
                fill
                className="object-cover object-center"
              />
            ) : (
              <span className="text-sm font-semibold text-blue-700">{initials}</span>
            )}
          </div>
          
          {/* Name & Chevron (Hidden on very small screens for responsiveness) */}
          <span className="text-sm font-medium hidden sm:block text-foreground">
            {name || "User"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </div>
      </DropdownMenuTrigger>

      {/* 2. Structured Dropdown Content */}
      <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border-border shadow-lg">
        
        {/* Header Section */}
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">Free Plan</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/60" />
        
        {/* Menu Items with Icons */}
        <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors">
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/60" />
        
        {/* 3. Danger Zone / Logout */}
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50 transition-colors">
          <div className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <LogoutButton />
          </div>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};