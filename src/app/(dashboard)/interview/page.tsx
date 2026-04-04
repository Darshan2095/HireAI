import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { InterviewItem } from "@/features/interview/components/interview-item";
import { GenerateInterview } from "@/features/interview/components/generate-interview";
import { 
  Terminal, 
  History, 
  LayoutDashboard, 
  CheckCircle2, 
  Target 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function InterviewPage() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      interviews: {
        orderBy: {
          createdAt: "desc",
        }
      },
    },
  });

  const totalQuestions = user?.interviews.length || 0;
  const completedQuestions = user?.interviews.filter(i => !!i.score).length || 0;
  const averageScore = totalQuestions > 0 
    ? Math.round(user!.interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / (completedQuestions || 1)) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      
      {/* 1. Page Title & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
            <Terminal className="h-4 w-4" />
            Preparation Arena
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Mock <span className="text-primary">Interview</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Sharpen your technical communication with AI-generated mock sessions.
          </p>
        </div>

        {/* Mini Performance Dashboard */}
        <div className="flex items-center gap-4 bg-card border border-border/60 rounded-[28px] p-2 shadow-sm">
          <div className="px-5 py-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Completed</p>
            <p className="text-xl font-bold flex items-center gap-2">
              {completedQuestions}<span className="text-muted-foreground/30 text-sm">/ {totalQuestions}</span>
            </p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="px-5 py-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Avg Score</p>
            <p className="text-xl font-bold text-primary">{averageScore}%</p>
          </div>
        </div>
      </div>

      {/* 2. Generation Command Center */}
      <section className="animate-in fade-in slide-in-from-top-6 duration-700">
        <GenerateInterview />
      </section>

      <Separator className="bg-border/60" />

      {/* 3. Interview History / List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Recent Sessions
          </h2>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
            Auto-saved
          </div>
        </div>

        {user?.interviews.length && user.interviews.length > 0 ? (
          <div className="grid gap-8">
            {user.interviews.map((interview) => (
              <InterviewItem
                key={interview.id}
                interview={interview}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-[32px] border-border/40 bg-muted/5 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold italic">No sessions yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mt-2">
              Click the generator above to start your first AI-powered interview simulation.
            </p>
          </div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}