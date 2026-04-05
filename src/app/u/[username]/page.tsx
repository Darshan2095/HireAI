import { prisma } from "@/database/prisma";
import { 
  User, 
  FileText, 
  Zap, 
  BarChart3, 
  Briefcase, 
  Mail, 
  ExternalLink,
  Award,
  CircleCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";

export default async function PublicProfile({
  params,
}: {
  params: { username: string };
}) {
  const user = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    include: {
      resumes: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      interviews: true,
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <User className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">User Not Found</h1>
        <p className="text-slate-500 mt-2">The profile you are looking for doesn't exist or has been moved.</p>
      </div>
    );
  }

  const latestResume = user.resumes[0];

  const averageInterview =
    user.interviews.length > 0
      ? Math.round(
          user.interviews.reduce(
            (a, b) => a + (b.score || 0),
            0
          ) / user.interviews.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-12 px-6">
        <Navbar />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <User className="h-12 w-12" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  {user.name}
                </h1>
                <Badge variant="secondary" className="w-fit mx-auto md:mx-0 bg-primary/10 text-primary border-none font-bold uppercase tracking-wider text-[10px]">
                  Public Profile
                </Badge>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-sm">
                  <Mail className="h-4 w-4" /> {user.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <ExternalLink className="h-4 w-4" /> hireai.com/{user.username}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-slate-50 p-6 rounded-[24px] border border-slate-100 min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Resume Score</span>
              <span className="text-4xl font-black text-primary">{latestResume?.score || "N/A"}</span>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className={`h-1 w-3 rounded-full ${s <= (latestResume?.score || 0) / 20 ? 'bg-primary' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience Card */}
            <Card className="rounded-[32px] border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-primary" /> Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {latestResume?.experience || "No experience details provided."}
                </p>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="rounded-[32px] border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-amber-500" /> Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {latestResume?.skills?.split(',').map((skill, i) => (
                    <Badge key={i} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-1.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
                      {skill.trim()}
                    </Badge>
                  )) || "No skills listed."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            {/* Interview Performance */}
            <Card className="rounded-[32px] border-slate-200/60 shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white/90 text-md">
                  <BarChart3 className="h-5 w-5 text-primary" /> Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">Interview Avg.</span>
                    <span className="text-sm font-bold text-primary">{averageInterview}%</span>
                  </div>
                  <Progress value={averageInterview} className="h-2 bg-white/10" />
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{user.interviews.length}</p>
                    <p className="text-[10px] uppercase text-white/40 tracking-widest">Mock Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {averageInterview > 70 ? 'High' : 'Stable'}
                    </p>
                    <p className="text-[10px] uppercase text-white/40 tracking-widest">Readiness</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Badge */}
            <div className="p-6 rounded-[32px] bg-indigo-50 border border-indigo-100 flex items-start gap-4">
               <div className="bg-indigo-600 p-2 rounded-xl">
                  <CircleCheck className="h-5 w-5 text-white" />
               </div>
               <div>
                  <p className="text-sm font-bold text-indigo-900">HireAI Verified</p>
                  <p className="text-xs text-indigo-700/70 mt-1">
                    This user's score was generated by our AI analysis engine.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
           <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
             Powered by HireAI Resume Analytics
           </p>
        </div>
      </div>
    </div>
  );
}