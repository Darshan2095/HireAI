"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Loader2, CheckCircle2, AlertCircle, AtSign } from "lucide-react";

interface ProfileFormProps {
  initialName?: string | null;
  initialUsername?: string | null;
}

export const ProfileForm = ({ initialName, initialUsername }: ProfileFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [username, setUsername] = useState(initialUsername || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Disable button if no changes were made
  const isUnchanged = name === initialName && username === initialUsername;

  const handleSave = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({ 
          name,
          username 
        }),
      });

      if (!response.ok) throw new Error();
      
      setStatus("success");
      router.refresh(); // Sync server components
      
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
              Update your public identity and how HireAI addresses you.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold tracking-tight">
            Display Name
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="name"
              placeholder="e.g. Darshan Babariya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-11 transition-all border-border/60 focus-visible:ring-primary/20"
            />
          </div>
          <p className="text-[12px] text-muted-foreground">
            This name will appear on your generated resumes and dashboard.
          </p>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold tracking-tight">
            Username
          </Label>
          <div className="relative group">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              className="pl-10 h-11 transition-all border-border/60 focus-visible:ring-primary/20"
            />
          </div>
          <p className="text-[12px] text-muted-foreground">
            Your unique identifier within the HireAI network.
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/20 border-t px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="h-4 w-4" /> Profile updated!
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-destructive animate-in fade-in slide-in-from-left-2">
              <AlertCircle className="h-4 w-4" /> Something went wrong.
            </span>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          disabled={status === "loading" || isUnchanged}
          className="min-w-[120px] rounded-xl shadow-md transition-all active:scale-95 bg-slate-900 hover:bg-slate-800 text-white"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};