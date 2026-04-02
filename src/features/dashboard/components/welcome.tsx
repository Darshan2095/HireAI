"use client";

import { Sparkles, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  name?: string | null;
}

export const Welcome = ({ name }: WelcomeProps) => {
  // Get current date for a "Live" feel
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
      {/* Background Decorative Elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-[80px]" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/5 blur-[80px]" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{name?.split(' ')[0] || "User"}</span> 👋
          </h2>
          
          <p className="max-w-[500px] text-muted-foreground text-sm md:text-base leading-relaxed">
            Your AI career assistant is ready. You have <span className="text-foreground font-semibold">3 new job matches</span> and your resume score improved by <span className="text-green-600 font-semibold">12%</span> this week.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            variant="default" 
            className="rounded-full px-6 h-11 bg-primary hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Resume
          </Button>
          
          <Button 
            variant="outline" 
            className="rounded-full px-6 h-11 border-border/60 hover:bg-secondary transition-all"
          >
            View Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};