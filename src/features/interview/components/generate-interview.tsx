"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Cpu, 
  ChevronRight, 
  Loader2, 
  Zap, 
  Code2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GenerateInterview = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await fetch("/api/interview/generate", {
        method: "POST",
        body: JSON.stringify({
          skills: "javascript react nextjs node",
        }),
      });
      router.refresh();
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative group overflow-hidden bg-card border border-border/60 rounded-[32px] p-1 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors" />
      
      <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Info & Icon */}
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="h-16 w-16 shrink-0 rounded-[22px] bg-gradient-to-br from-primary to-purple-600 p-[1px]">
            <div className="h-full w-full rounded-[21px] bg-card flex items-center justify-center">
              <Cpu className={cn(
                "h-7 w-7 text-primary transition-all duration-700",
                isGenerating ? "animate-pulse scale-110" : "group-hover:rotate-12"
              )} />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase text-primary tracking-[0.3em]">
              <Zap className="h-3 w-3 fill-current" /> AI Engine Ready
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Mock <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Interview</span>
            </h2>
            <p className="text-sm text-muted-foreground font-medium max-w-[280px]">
              Generate technical questions based on your specialized tech stack.
            </p>
          </div>
        </div>

        {/* Right Side: Skill Tags & Action */}
        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
          <div className="flex flex-wrap justify-center md:justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {['JS', 'React', 'Next.js', 'Node'].map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full border border-border bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "relative h-14 px-10 rounded-full font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300",
              isGenerating 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 active:scale-95"
            )}
          >
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Session
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
            
            {/* Glossy Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          </Button>
        </div>
      </div>
      
      {/* Bottom Visual Progress Bar (Hidden unless generating) */}
      {isGenerating && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary animate-progress-loading" />
      )}
    </div>
  );
};