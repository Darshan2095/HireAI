"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  name?: string | null;
}

export const ProfileForm = ({ name }: ProfileFormProps) => {
  const [userName, setUserName] = useState(name || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSave = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({ name: userName }),
      });

      if (!response.ok) throw new Error();
      
      setStatus("success");
      // Reset to idle after 3 seconds to let the user edit again
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Card className="max-w-2xl border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-sm">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Update your profile name as it will appear on your resumes.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold tracking-tight">
            Display Name
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="name"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="pl-10 h-11 transition-all border-border/60 focus-visible:ring-primary/20"
            />
          </div>
          <p className="text-[12px] text-muted-foreground">
            This name will be used by HireAI to personalize your career dashboard.
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/20 border-t px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="h-4 w-4" /> Changes saved!
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-destructive animate-in fade-in slide-in-from-left-2">
              <AlertCircle className="h-4 w-4" /> Update failed.
            </span>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          disabled={status === "loading" || userName === name}
          className="min-w-[100px] rounded-lg shadow-sm transition-all active:scale-95"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};