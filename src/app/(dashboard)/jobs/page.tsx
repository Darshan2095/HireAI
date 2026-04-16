import { prisma } from "@/database/prisma";
import { JobItem } from "@/features/jobs/components/job-item";
import { Briefcase, Sparkles, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      
      {/* 1. Hero Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" />
            AI-Powered Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Job <span className="text-primary">Matches</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            We've analyzed your latest resume to find roles where your tech stack shines brightest.
          </p>
        </div>

        {/* Quick Stats / Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border/60 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Ops</span>
              <span className="text-xl font-bold">{jobs.length}</span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">High Match</span>
              <span className="text-xl font-bold text-emerald-500">
                {jobs.filter(j => (j.matchScore ?? 0) >= 80).length}
              </span>
            </div>
          </div>
          
          <button className="h-12 w-12 rounded-2xl bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* 2. Responsive Grid Container */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobItem
              key={job.id}
              job={{
                ...job,
                matchScore: job.matchScore ?? 0,
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-[32px] border-border/40 bg-muted/5">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold">No matches found yet</h3>
          <p className="text-muted-foreground text-sm">Try uploading a more detailed resume to trigger the engine.</p>
        </div>
      )}

      {/* 3. Bottom Decorative Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </div>
  );
}