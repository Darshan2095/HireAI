import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const DashboardStats = async () => {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resumes: true },
  });

  const resumes = user?.resumes || [];
  const totalResumes = resumes.length;
  const scores = resumes
    .map((r) => r.score)
    .filter((score): score is number => score !== null && score !== undefined);

  const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const stats = [
    {
      title: "Total Resumes",
      value: totalResumes,
      icon: FileText,
      description: "Resumes uploaded to date",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: Target,
      description: "Average AI optimization level",
      color: averageScore > 70 ? "text-green-600" : "text-yellow-600",
      bg: averageScore > 70 ? "bg-green-500/10" : "bg-yellow-500/10",
    },
    {
      title: "Best Resume",
      value: `${bestScore}%`,
      icon: Award,
      description: "Highest achieved score",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground italic">
              {stat.title}
            </CardTitle>
            <div className={cn("p-2 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {stat.value}
              </h2>
              {stat.value !== 0 && (
                 <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    Live
                 </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {stat.description}
            </p>
          </CardContent>
          
          {/* Bottom decorative accent line */}
          <div className={cn("h-1 w-full", stat.bg.replace('/10', '/30'))} />
        </Card>
      ))}
    </div>
  );
};