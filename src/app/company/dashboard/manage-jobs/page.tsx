import { prisma } from "@/database/prisma";
import { 
  Briefcase, 
  Users, 
  Search, 
  Trophy, 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  Zap,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function ManageJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      applications: {
        include: {
          user: {
            include: { resumes: true },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <Zap className="h-3 w-3 fill-current" /> Admin Control
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Manage Jobs</h1>
          <p className="text-slate-500 font-medium">Review your active listings and find your next top performer.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600 px-4 py-2 rounded-xl shadow-sm">
             {jobs.length} Active Posts
           </Badge>
        </div>
      </div>

      {jobs.length === 0 && (
        <Card className="border-dashed border-2 bg-slate-50/50 py-20 text-center rounded-[32px]">
          <CardContent className="flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-slate-500 font-bold">No jobs posted yet.</p>
          </CardContent>
        </Card>
      )}

      {/* Accordion List for Jobs */}
      <Accordion type="single" collapsible className="space-y-4">
        {jobs.map((job) => {
          const applicantCount = job.applications.length;
          
          return (
            <AccordionItem 
              key={job.id} 
              value={job.id} 
              className="border border-slate-200/60 bg-white rounded-[24px] overflow-hidden shadow-sm px-2 transition-all hover:border-primary/20 data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="hover:no-underline py-6 px-4">
                <div className="flex flex-1 items-center justify-between text-left pr-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-none">{job.title}</h2>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{applicantCount}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Applicants</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-6">
                <div className="pt-4 border-t border-slate-50 space-y-6">
                  {/* Job Briefing */}
                  <div className="bg-slate-50/50 p-4 rounded-2xl">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description Snippet</p>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">"{job.description}"</p>
                  </div>

                  {/* Applicant Ranking System */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" /> Sorted by HireAI Score
                      </h3>
                    </div>

                    {applicantCount === 0 ? (
                      <div className="text-center py-10 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400">Waiting for the first candidate...</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {[...job.applications]
                          .sort((a, b) => (b.user.resumes[0]?.score || 0) - (a.user.resumes[0]?.score || 0))
                          .map((app, index) => {
                            const resume = app.user.resumes[0];
                            const isTopMatch = index === 0;

                            return (
                              <div 
                                key={app.id} 
                                className={cn(
                                  "relative group p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                                  isTopMatch 
                                    ? "bg-linear-to-r from-primary/5 to-transparent border-primary/20 shadow-sm" 
                                    : "bg-white border-slate-100 hover:border-slate-300"
                                )}
                              >
                                {isTopMatch && (
                                  <div className="absolute -top-2 -left-2 bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                    <Trophy className="h-3 w-3" /> TOP MATCH
                                  </div>
                                )}

                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {app.user.name?.[0] || "U"}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-slate-900">{app.user.name}</p>
                                      <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] h-4">
                                        Rank #{index + 1}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {app.user.email}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                  {/* Score visualization */}
                                  <div className="text-center md:text-right px-4 py-2 bg-white rounded-xl border border-slate-100">
                                    <p className="text-lg font-black text-primary leading-none">{resume?.score ?? "N/A"}</p>
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter mt-1">AI Score</p>
                                  </div>

                                  <div className="flex-1 min-w-37.5 max-w-xs hidden xl:block">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Top Skills</p>
                                    <p className="text-[11px] font-medium text-slate-600 truncate">{resume?.skills || "N/A"}</p>
                                  </div>

                                  <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-200">
                                    View Resume <ExternalLink className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}