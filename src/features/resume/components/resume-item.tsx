"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FileText, Trash2, Sparkles, ExternalLink, 
  Loader2, CheckCircle2, BrainCircuit, Wrench, 
  Calendar, Layers, Briefcase, ArrowRight,
  TrendingUp, Hash, ClipboardCheck, Wand2
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
    // New Fields
    improvements?: string | null;
    keywords?: string | null;
    optimized?: string | null;
  };
}

export const ResumeItem = ({ resume }: ResumeItemProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch("/api/resume/delete", { method: "POST", body: JSON.stringify({ id: resume.id }) });
      router.refresh();
    } catch (error) { setIsDeleting(false); }
  };

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      await fetch("/api/jobs/match", { method: "POST", body: JSON.stringify({ resumeId: resume.id }) });
      router.push("/jobs");
    } catch (error) { console.error(error); } finally { setIsMatching(false); }
  };

  const handleImprove = async () => {
    setIsImproving(true);
    try {
        await fetch("/api/resume/improve", {
          method: "POST",
          body: JSON.stringify({ resumeId: resume.id }),
        });
        router.refresh();
    } catch (error) { console.error(error); } finally { setIsImproving(false); }
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
      "group relative bg-card border border-border/50 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5",
      (loading || isMatching || isImproving) && "ring-2 ring-primary/20 animate-pulse"
    )}>
      
      {/* 1. Main Action Row */}
      <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0 h-20 w-20 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-muted/10" />
              <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="5" 
                strokeDasharray={226} 
                strokeDashoffset={226 - (226 * score) / 100} 
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500",
                  !isAnalyzed && "text-muted/20"
                )} 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black tracking-tighter">{isAnalyzed ? `${score}%` : "--"}</span>
              {isAnalyzed && <span className="text-[8px] font-bold uppercase text-muted-foreground">Match</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Link href={resume.fileUrl} target="_blank" className="text-lg font-bold flex items-center gap-2 group/link">
              <span className="bg-primary/10 p-1.5 rounded-lg"><FileText className="h-4 w-4 text-primary" /></span>
              <span className="group-hover/link:text-primary transition-colors truncate max-w-[200px] md:max-w-md">Resume_Analysis_{resume.id.slice(-4)}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-all" />
            </Link>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 opacity-70" /> {new Date(resume.createdAt).toLocaleDateString()}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 opacity-70" /> PDF</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
          {isAnalyzed ? (
            <>
              <Button 
                onClick={handleImprove}
                disabled={isImproving}
                variant="outline"
                className="rounded-full px-5 border-purple-200 hover:bg-purple-50 text-purple-700 gap-2 transition-all active:scale-95"
              >
                {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Optimize
              </Button>
              <Button 
                onClick={handleMatch} 
                disabled={isMatching}
                className="rounded-full px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 gap-2 group/match"
              >
                {isMatching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                Find Matches
                <ArrowRight className="h-4 w-4 transition-transform group-hover/match:translate-x-1" />
              </Button>
            </>
          ) : (
            <Button onClick={handleAnalyze} disabled={loading} className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyze with AI
            </Button>
          )}
          <Button onClick={handleDelete} disabled={isDeleting} size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50"><Trash2 className="h-5 w-5" /></Button>
        </div>
      </div>

      {/* 2. Intelligence Section */}
      {isAnalyzed && (
        <div className="px-8 pb-8 space-y-6 animate-in fade-in duration-700">
          <div className="rounded-[28px] bg-muted/20 border border-border/30 p-6 space-y-8">
            
            {/* Row 1: Skills & Ecosystem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Core Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills?.split(',').map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-background/80 text-[10px] font-bold px-3 py-0.5 rounded-md border-none">{skill.trim()}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                   <Wrench className="h-3.5 w-3.5 text-blue-500" /> Technical Ecosystem
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.technologies?.split(',').map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-blue-500/5 border-blue-200 text-blue-700 text-[10px] font-bold px-3 py-0.5 rounded-md">{tech.trim()}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Row 2: Improvements & Keywords (The New Stuff) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resume.improvements && (
                <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5" /> Growth Areas
                  </p>
                  <p className="text-sm text-amber-900/80 leading-relaxed font-medium italic">
                    {resume.improvements}
                  </p>
                </div>
              )}
              {resume.keywords && (
                <div className="space-y-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5" /> ATS Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.keywords.split(',').map((kw, i) => (
                      <span key={i} className="text-[11px] font-bold text-primary/70">#{kw.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Optimized Summary */}
            {resume.optimized && (
              <div className="space-y-3 bg-background/50 border border-border/40 rounded-2xl p-5 shadow-inner">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" /> AI-Optimized Professional Summary
                </p>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {resume.optimized}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Full-Screen AI Overlays */}
      {(loading || isMatching || isImproving) && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
          <div className="flex flex-col items-center gap-6 text-center max-w-sm">
             <div className="h-20 w-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
             </div>
             <p className="text-lg font-bold tracking-tight">
                {loading && "Analyzing Profile..."}
                {isMatching && "Sourcing Career Matches..."}
                {isImproving && "Generating Optimizations..."}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};