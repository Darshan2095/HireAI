import { UploadResume } from "@/features/resume/components/upload-resume";
import { ResumeList } from "@/features/resume/components/resume-list";
import { FileText, ShieldCheck, Zap, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ResumePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-3 duration-700">
      
      {/* 1. Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" />
            Document Center
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Resumes
          </h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Upload, manage, and optimize your resumes with <span className="text-foreground font-semibold">AI-powered tracking</span>.
          </p>
        </div>

        {/* Feature Highlights - Subtle trust indicators */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
            ATS Optimized
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500/50" />
            Instant Analysis
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* 2. Featured Action Zone (Upload) */}
      <section className="relative group">
        {/* Decorative background glow behind the upload zone */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative">
          <UploadResume />
        </div>
      </section>

      {/* 3. Information Alert (Optional - High-end touch) */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide">Pro Tip</h4>
          <p className="text-xs text-blue-600/80 leading-relaxed">
            For the best AI accuracy, ensure your PDF is text-selectable and doesn&apos;t contain heavy graphics or multi-column layouts.
          </p>
        </div>
      </div>

      {/* 4. The Resume Library */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold tracking-tight">Your Document Library</h3>
        </div>
        
        <div className="bg-card/30 rounded-[2rem] border border-border/40 p-1">
          <ResumeList />
        </div>
      </section>
    </div>
  );
}