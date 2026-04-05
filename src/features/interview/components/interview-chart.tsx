"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Award, Calendar } from "lucide-react";

export const InterviewChart = ({ data }: any) => {
  // Custom Tooltip for a "SaaS" look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <p className="text-sm font-bold text-foreground">
              Score: <span className="text-primary">{payload[0].value}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group bg-card border border-border/60 rounded-[32px] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
            <TrendingUp className="h-3 w-3" />
            Growth Analytics
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Performance <span className="text-muted-foreground/50 italic font-medium">History</span>
          </h2>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-muted/30 border border-border/50 rounded-xl flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold">Progress Tracking</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              opacity={0.5} 
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
              domain={[0, 100]}
              tickCount={6}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          Last 30 Days
        </div>
        <p>Live AI Evaluations</p>
      </div>
    </div>
  );
};