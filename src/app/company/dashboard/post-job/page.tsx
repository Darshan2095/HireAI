import { PostJob } from "@/features/company/components/post-job";
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PostJobPage() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Navigation & Breadcrumb */}
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href="/company/dashboard" 
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Dashboard
        </Link>
        <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold px-3 py-1 rounded-lg uppercase tracking-widest text-[10px]">
          Drafting Mode
        </Badge>
      </div>

      {/* Hero Header */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">New Listing</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Create a Job Post
            </h1>
            <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
              Define your requirements and find the perfect candidate from our 
              pool of engineering talent.
            </p>
          </div>
          
          {/* Trust Badges for Recruiter */}
          <div className="hidden lg:flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">Verified Listing</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">AI Assisted</span>
             </div>
          </div>
        </div>
      </section>

      {/* The Form Container */}
      <main className="relative">
        {/* Background Decorative Element */}
        <div className="absolute -top-10 -right-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="bg-white border border-slate-200/60 rounded-[32px] shadow-sm overflow-hidden relative z-10">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              Job Specifications
            </h2>
          </div>
          
          <div className="p-8 md:p-12">
            {/* The actual feature component */}
            <PostJob />
          </div>
        </div>

        {/* Post-Form Guidance */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Writing Tip</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Be specific about the tech stack (e.g., Next.js, PostgreSQL). Clearer descriptions get 40% more qualified applicants.
              </p>
           </div>
           <div className="p-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Visibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once published, this job will be visible to all students in the 6th and 7th semesters instantly.
              </p>
           </div>
        </div>
      </main>

      <footer className="mt-12 text-center pb-10">
         <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
           Secure Hiring with HireAI Cloud
         </p>
      </footer>
    </div>
  );
}