"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Lightbulb, 
  BarChart3,
  SendHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface InterviewItemProps {
  interview: {
    id: string;
    question: string;
    score?: number | null;
    feedback?: string | null;
    answer?: string | null;
  };
}

export const InterviewItem = ({ interview }: InterviewItemProps) => {
  const router = useRouter();
  const [answer, setAnswer] = useState(interview.answer || "");
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    if (!answer.trim()) return;
    try {
      setLoading(true);
      await fetch("/api/interview/evaluate", {
        method: "POST",
        body: JSON.stringify({
          id: interview.id,
          answer,
        }),
      });
      router.refresh();
    } catch {
      alert("Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const isEvaluated = !!interview.score;

  return (
    <div className="group bg-card border border-border/60 rounded-[32px] overflow-hidden transition-all duration-300 hover:border-primary/30">
      
      {/* 1. Question Header */}
      <div className="p-8 pb-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Interview Question</p>
            <h2 className="text-xl font-bold leading-tight text-foreground/90">
              {interview.question}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Answer Input Area */}
      <div className="px-8 pb-8 space-y-4">
        <div className="relative group/input">
          <Textarea
            placeholder="Craft your response here..."
            className="min-h-[160px] bg-muted/20 border-border/40 rounded-[20px] p-5 text-base leading-relaxed focus-visible:ring-primary/20 resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isEvaluated || loading}
          />
          {!isEvaluated && (
            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              Shift + Enter to submit
            </div>
          )}
        </div>

        {!isEvaluated && (
          <Button
            onClick={handleEvaluate}
            className="w-full md:w-auto rounded-full px-8 h-12 bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all gap-2 font-bold"
            disabled={loading || !answer.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Submit for AI Evaluation
          </Button>
        )}
      </div>

      {/* 3. AI Result Section (Only shown after evaluation) */}
      {isEvaluated && (
        <div className="bg-muted/30 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Score Display */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-background border border-border/60 flex items-center justify-center relative">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {interview.score}%
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">Performance Score</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">AI Assessment</p>
                </div>
              </div>

              {/* Status Badge */}
              <Badge className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border shadow-none",
                (interview.score || 0) >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}>
                {(interview.score || 0) >= 80 ? "Industry Ready" : "Practice Recommended"}
              </Badge>
            </div>

            <Separator className="bg-border/40" />

            {/* Feedback Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-[0.2em]">
                <Sparkles className="h-3.5 w-3.5" /> 
                Detailed AI Critique
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 bg-background/50 rounded-2xl p-5 border border-border/40">
                  <p className="text-sm leading-relaxed text-foreground/80 italic">
                    "{interview.feedback}"
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-3">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                        <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                        <p className="text-[11px] font-medium leading-tight">Focus on quantifying your impact with metrics.</p>
                    </div>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => { setAnswer(""); router.refresh(); }}
              className="rounded-full px-6 border-border/60 hover:bg-background text-xs font-bold uppercase tracking-widest"
            >
              Reset & Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};