import Link from "next/link";
import { 
  FileText, 
  Target, 
  Video, 
  Zap, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2,
  Sparkles,
  MousePointer2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-primary/10">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      {/* Navbar - Styled like your Dashboard */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/60 bg-white/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Hire<span className="text-primary">AI</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-600 font-semibold hover:text-primary">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all active:scale-95">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in zoom-in duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Powered Career Suite 2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-[1.05]">
          Your Career, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
            Optimized by Intelligence.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform to analyze resumes, find high-package jobs, 
          and practice interviews with real-time AI feedback.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 transition-all active:scale-95">
              Start Free Analysis <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Floating Stats Badge */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            <Stat label="Active Users" value="10k+" />
            <Stat label="Resumes Analyzed" value="50k+" />
            <Stat label="Jobs Matched" value="12k+" />
        </div>
      </section>

      {/* Features Section - White Cards with Soft Borders */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Master Every Step</h2>
            <p className="text-slate-500">Professional tools designed to get you past the initial screening and into the interview room.</p>
          </div>
          <Link href="/dashboard" className="text-primary font-bold flex items-center gap-1 hover:underline">
            View all tools <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<FileText className="text-primary" />}
            title="Resume Analysis"
            desc="Upload your PDF and get a 1-100 score based on ATS readability and keyword density."
          />
          <FeatureCard 
            icon={<Target className="text-indigo-500" />}
            title="Smart Job Matching"
            desc="We match your specific skills with live job openings from top-tier tech companies."
          />
          <FeatureCard 
            icon={<Video className="text-rose-500" />}
            title="AI Mock Interviews"
            desc="Practice with custom voice interviews and get feedback on your communication style."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-500" />}
            title="Resume Optimizer"
            desc="Let AI rewrite your experience bullet points to sound more professional and impactful."
          />
          <FeatureCard 
            icon={<MousePointer2 className="text-emerald-500" />}
            title="Tracking System"
            desc="Keep all your job applications, notes, and interview dates in one organized dashboard."
          />
          <FeatureCard 
            icon={<BarChart3 className="text-blue-500" />}
            title="Career Insights"
            desc="Analyze market trends for your tech stack and see where you rank among competitors."
          />
        </div>
      </section>

      {/* CTA Section - Sophisticated Indigo Gradient */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-white border border-slate-200 p-8 md:p-16 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
             <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Ready to automate your <br className="hidden md:block" /> job search?
            </h2>
            <p className="text-slate-500 mb-10 max-w-lg mx-auto text-lg">
              Join students and developers worldwide who are using AI to land high-paying placements.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1.5 rounded-lg">
               <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-slate-900 font-bold tracking-tight">HireAI</span>
          </div>
          <div className="flex gap-10 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="text-sm">© 2026 HireAI. Built for next-gen careers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-[32px] bg-white border border-slate-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-500">
        <div className="h-6 w-6">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center">
            <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        </div>
    )
}