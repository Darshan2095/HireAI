import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Send, 
  Users, 
  Activity, 
  ArrowUpRight, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Applications",
    value: "0",
    label: "Total Sent",
    icon: Send,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    trend: "+0% this week"
  },
  {
    title: "Interviews",
    value: "0",
    label: "Upcoming",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    trend: "Awaiting invites"
  },
  {
    title: "Resume Score",
    value: "--",
    label: "Avg. Accuracy",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    trend: "Upload to analyze"
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((item, index) => (
        <Card 
          key={index} 
          className="relative overflow-hidden border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
        >
          {/* Subtle Gradient Glow on Hover */}
          <div className={cn(
            "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
            item.bg
          )} />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                {item.title}
              </CardTitle>
            </div>
            <div className={cn("p-2.5 rounded-xl transition-colors", item.bg)}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {item.value === "--" ? (
                    <span className="text-muted-foreground/40 italic font-medium">N/A</span>
                  ) : (
                    item.value
                  )}
                </h2>
                <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                   {item.label}
                </p>
              </div>

              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border",
                item.value === "0" || item.value === "--" 
                  ? "bg-secondary/50 text-muted-foreground border-transparent" 
                  : "bg-green-500/10 text-green-600 border-green-500/20"
              )}>
                {item.value !== "0" && item.value !== "--" && <ArrowUpRight className="h-3 w-3" />}
                {item.trend}
              </div>
            </div>

            {/* Bottom "Live" Progress Bar (Visual Polish) */}
            <div className="mt-4 w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  item.value === "0" || item.value === "--" ? "w-0" : "w-1/3",
                  item.bg.replace('/10', '/80')
                )} 
              />
            </div>
          </CardContent>
          
          {/* Feature Badge for empty states */}
          {item.value === "--" && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/[0.03] rounded text-[9px] font-bold text-primary/40 uppercase tracking-tighter">
              <Sparkles className="w-2.5 h-2.5" />
              AI Powered
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};