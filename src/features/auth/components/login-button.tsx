"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";

export const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      // signIn handles the redirect, but wrapping it allows us to
      // trigger the loading state immediately on click.
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      // If something fails locally before the redirect, reset the button
      console.error("Authentication error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant="outline"
      className="w-full sm:w-auto relative flex items-center justify-center gap-3 px-6 py-6 text-sm font-medium transition-all duration-200 border-border/60 hover:bg-secondary hover:border-foreground/20 shadow-sm rounded-xl overflow-hidden group"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground animate-pulse">
            Authenticating...
          </span>
        </>
      ) : (
        <>
          <Code2 className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span>Continue with GitHub</span>
        </>
      )}
      
      {/* Subtle shine effect on hover for that premium feel */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
    </Button>
  );
};