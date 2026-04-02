import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { ResumeItem } from "./resume-item";
import { FileStack, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ResumeList = async () => {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: 'desc' // Always show newest first
        }
      },
    },
  });

  // --- 1. Enhanced Empty State ---
  if (!user?.resumes.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-muted/10 border-border/60 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border/40 mb-4">
          <FileStack className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">No resumes yet</h3>
        <p className="text-muted-foreground mt-2 max-w-[280px] text-sm">
          Upload your first resume to start getting <span className="text-primary font-medium">AI-powered insights</span> and job matches.
        </p>
        <Link href="/resume" className="mt-6">
          <Button variant="outline" className="rounded-full px-6 group border-primary/20 hover:border-primary/50 transition-all">
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
            Upload First Resume
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- 2. Section Header --- */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            Recent Uploads
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
              {user.resumes.length} Total
            </span>
          </h2>
          <p className="text-xs text-muted-foreground italic">
            Manage and track the performance of your analyzed resumes.
          </p>
        </div>
        
        {/* Subtle "Quick Refresh" visual cue */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-green-600/80 uppercase tracking-tighter bg-green-500/5 px-2 py-1 rounded-md border border-green-500/10">
          <Sparkles className="h-3 w-3" />
          Syncing Live
        </div>
      </div>

      {/* --- 3. The List Container --- */}
      <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 duration-700">
        {user.resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </div>
  );
};