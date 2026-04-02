"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // We set redirect: true (default) to ensure the user is 
      // sent back to the landing/login page after the session is cleared.
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "flex items-center w-full text-left transition-all duration-200",
        isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-2 w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium animate-pulse">
              Signing out...
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">Log out</span>
          </>
        )}
      </div>
    </button>
  );
};