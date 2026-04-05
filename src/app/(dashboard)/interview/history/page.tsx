import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { InterviewChart } from "@/features/interview/components/interview-chart";
import { 
  BarChart3, 
  Target, 
  Trophy, 
  Activity, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function InterviewHistory() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      interviews: {
        orderBy: { createdAt: "asc" } // Chart looks better chronologically
      },
    },
  });

  const data = user?.interviews.map((i) => ({
    score: i.score || 0,
    date: new Date(i.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  })) || [];

  const totalInterviews = data.length;
  const average = totalInterviews > 0 
    ? Math.round(data.reduce((a, b) => a + b.score, 0) / totalInterviews) 
    : 0;

  // Dynamic status based on average
  const getStatus = (avg: number) => {
    if (avg >= 85) return { label: "Elite", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (avg >= 70) return { label: "Placement Ready", color: "text-blue-500", bg: "bg-blue-500/10" };
    return { label: "Keep Practicing", color: "text-amber-500", bg: "bg-amber-500/10" };
  };

  const status = getStatus(average);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.25em]">
            <Activity className="h-4 w-4" />
            Performance Insights
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Interview <span className="text-primary">Reports</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Visualizing your technical growth and readiness for the upcoming placement season.
          </p>
        </div>

        <div className={`px-6 py-3 rounded-2xl border border-current/10 flex items-center gap-3 ${status.bg} ${status.color}`}>
          <Trophy className="h-5 w-5" />
          <span className="font-black text-xs uppercase tracking-widest">{status.label}</span>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* 2. Top-Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Score Card */}
        <div className="bg-card border border-border/60 p-6 rounded-[28px] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Target className="h-5 w-5" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Avg Efficiency</p>
          <h3 className="text-3xl font-black mt-1">{average}%</h3>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${average}%` }} />
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-card border border-border/60 p-6 rounded-[28px] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <BarChart3 className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Sessions</p>
          <h3 className="text-3xl font-black mt-1">{totalInterviews}</h3>
          <p className="text-[11px] text-muted-foreground mt-2 font-medium italic">Evaluated by AI Engine</p>
        </div>

        {/* Placement Readiness Card */}
        <div className="bg-card border border-border/60 p-6 rounded-[28px] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Readiness Level</p>
          <h3 className="text-3xl font-black mt-1">{average > 80 ? "High" : "Developing"}</h3>
          <p className="text-[11px] text-muted-foreground mt-2 font-medium">Target: 7th Sem Placements</p>
        </div>
      </div>

      {/* 3. The Performance Chart */}
      <div className="animate-in fade-in zoom-in-95 duration-700">
        <InterviewChart data={data} />
      </div>

      {/* Decorative footer */}
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] opacity-30 pt-10">
        Data synchronized with cloud records
      </p>
    </div>
  );
}