"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FileText, Trash2, Sparkles, ExternalLink, 
  Loader2, CheckCircle2, BrainCircuit, Wrench, 
  Calendar, Layers, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ResumeItemProps {
  resume: {
    id: string;
    fileUrl: string;
    createdAt: Date;
    score?: number | null;
    feedback?: string | null;
    skills?: string | null;
    technologies?: string | null;
    experience?: string | null;
  };
}

export const ResumeItem = ({ resume }: ResumeItemProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch("/api/resume/delete", { method: "POST", body: JSON.stringify({ id: resume.id }) });
      router.refresh();
    } catch (error) { setIsDeleting(false); }
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      await fetch("/api/resume/analyze", { method: "POST", body: JSON.stringify({ resumeId: resume.id }) });
      router.refresh();
    } catch (error) { alert("Analysis failed"); } finally { setLoading(false); }
  };

  const score = resume.score ?? 0;
  const isAnalyzed = resume.score !== null && resume.score !== undefined;

  return (
    <div className={cn(
      "group relative bg-card border border-border/50 rounded-[24px] overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
      loading && "animate-pulse ring-2 ring-primary/20"
    )}>
      
      {/* 1. Main Action Row */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Visual Score Ring */}
          <div className="relative flex-shrink-0 h-16 w-16 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-muted/20" />
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" 
                strokeDasharray={175} 
                strokeDashoffset={175 - (175 * score) / 100} 
                className={cn(
                  "transition-all duration-1000",
                  score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500",
                  !isAnalyzed && "text-muted/20"
                )} 
              />
            </svg>
            <span className="absolute text-lg font-black tracking-tighter">
              {isAnalyzed ? `${score}%` : "--"}
            </span>
          </div>

          <div className="space-y-1">
            <Link href={resume.fileUrl} target="_blank" className="text-base font-bold flex items-center gap-2 group/link">
              <FileText className="h-4 w-4 text-primary" />
              <span className="group-hover/link:text-primary transition-colors">Resume_Analysis_{resume.id.slice(-4)}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-all" />
            </Link>
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(resume.createdAt).toLocaleDateString()}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> PDF Document</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleAnalyze} disabled={loading} size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {isAnalyzed ? "Re-Analyze" : "Start AI Audit"}
          </Button>
          <Button onClick={handleDelete} disabled={isDeleting} size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Intelligence Section (Only if analyzed) */}
      {isAnalyzed ? (
        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="rounded-[20px] bg-muted/30 border border-border/40 p-5 space-y-5">
            {/* Feedback Bubble */}
            <div className="flex gap-3">
              <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-background border flex items-center justify-center shadow-sm">
                <BrainCircuit className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest">AI Feedback</p>
                <p className="text-sm leading-relaxed text-foreground/80 italic font-medium">
                  "{resume.feedback}"
                </p>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Grid for Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                   <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Core Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills?.split(',').map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-background border-border/50 text-[10px] font-bold px-2 py-0">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                   <Wrench className="h-3 w-3 text-blue-500" /> Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.technologies?.split(',').map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-blue-500/5 border-blue-500/20 text-blue-700 text-[10px] font-bold px-2 py-0">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="h-20 flex items-center justify-center border-2 border-dashed rounded-[20px] border-border/40 bg-muted/10 group-hover:bg-primary/5 transition-colors group/empty">
             <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 group-hover:animate-pulse" />
                Click analyze to unlock AI insights and score.
             </p>
          </div>
        </div>
      )}

      {/* 3. Waiting Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
             </div>
             <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-primary">Neural Analysis In Progress</p>
                <p className="text-xs text-muted-foreground px-10">We are cross-referencing your profile with 500+ industry standards...</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};