import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { 
  ClipboardList, 
  Building2, 
  Clock, 
  ArrowUpRight, 
  Search,
  CheckCircle2,
  XCircle,
  Timer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      applications: {
        include: {
          job: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "hired":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "rejected": return <XCircle className="h-3.5 w-3.5" />;
      default: return <Timer className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            My Applications
          </h1>
          <p className="text-muted-foreground font-medium">
            Track your progress across {user?.applications.length || 0} active opportunities.
          </p>
        </div>
        
        <div className="relative group w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Search my apps..." 
            className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <Separator className="opacity-60" />

      {/* 2. Applications List */}
      <div className="grid gap-4">
        {user?.applications.length && user.applications.length > 0 ? (
          user.applications.map((app) => (
            <div 
              key={app.id} 
              className="group bg-card border border-border/50 rounded-[24px] p-5 md:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                {/* Company Avatar */}
                <div className="h-14 w-14 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Building2 className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {app.job.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-semibold">{app.job.company}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                <Badge className={cn("px-4 py-1.5 rounded-full border shadow-none gap-2 capitalize font-bold tracking-tight", getStatusStyle(app.status))}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </Badge>
                
                <Link 
                  href={`/jobs/${app.job.id}`} 
                  className="p-2.5 rounded-xl border border-border/60 text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="py-24 text-center border-2 border-dashed rounded-[32px] border-border/30 bg-muted/5">
            <h3 className="text-xl font-bold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-8">Ready to start your journey?</p>
            <Link href="/jobs" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Browse Matches
            </Link>
          </div>
        )}
      </div>

      {/* 3. Footer Tip */}
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-40">
        Updates automatically every 15 minutes
      </p>
    </div>
  );
}