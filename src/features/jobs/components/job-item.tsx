"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Zap, 
  ChevronRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobProps {
  job: {
    id: string;
    title: string;
    company: string;
    description: string;
    matchScore: number;
    location?: string;
    type?: string; // e.g., Full-time, Remote
  };
}

export const JobItem = ({ job }: JobProps) => {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await fetch("/api/jobs/apply", {
        method: "POST",
        body: JSON.stringify({ jobId: job.id }),
      });
      setApplied(true);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="group relative bg-card border border-border/50 rounded-[24px] p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
      
      {/* Top Row: Company & Match Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
              {job.company}
            </p>
          </div>
        </div>

        {/* AI Match Badge */}
        <div className={cn(
          "flex flex-col items-end px-3 py-1.5 rounded-xl border",
          job.matchScore >= 80 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" 
            : "bg-amber-500/5 border-amber-500/20 text-amber-600"
        )}>
          <span className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
            <Zap className="h-3 w-3 fill-current" /> AI Match
          </span>
          <span className="text-lg font-black leading-none">{job.matchScore}%</span>
        </div>
      </div>

      {/* Middle: Description/Tags */}
      <div className="space-y-4 mb-6">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location || "Remote"}
          </Badge>
          <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> {job.type || "Full-time"}
          </Badge>
        </div>
      </div>

      {/* Footer: Apply Button */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {applied ? "Application Sent" : "Ready to apply?"}
        </div>
        
        <Button
          onClick={handleApply}
          disabled={isApplying || applied}
          className={cn(
            "rounded-full px-6 transition-all duration-300",
            applied 
              ? "bg-emerald-500 hover:bg-emerald-500 text-white" 
              : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
          )}
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : applied ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Applied
            </div>
          ) : (
            <div className="flex items-center gap-1">
              Apply Now <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </div>

      {/* Match Glow Effect (Top Corner) */}
      <div className={cn(
        "absolute -top-px -right-px h-16 w-16 opacity-10 rounded-tr-[24px] blur-2xl",
        job.matchScore >= 80 ? "bg-emerald-500" : "bg-amber-500"
      )} />
    </div>
  );
};