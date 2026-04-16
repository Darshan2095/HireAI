import { prisma } from "@/database/prisma";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  Settings, 
  ChevronRight,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function CompanyDashboard() {
    const [jobs, recentJobs] = await Promise.all([
        prisma.job.findMany({
            include: {
                applications: true,
            },
        }),
        prisma.job.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                applications: true,
            },
        }),
    ]);

    const totalJobs = jobs.length;
    const totalApplicants = jobs.reduce((count, job) => count + job.applications.length, 0);
    const avgApplicantsPerJob = totalJobs > 0 ? (totalApplicants / totalJobs).toFixed(1) : "0.0";

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Hero Section */}
            <section className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">
                        Hiring Hub
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Recruiter Dashboard</h1>
                    <p className="mt-3 text-slate-400 max-w-md leading-relaxed">
                        Track your hiring momentum and jump into job operations. You have <span className="text-white font-bold">{totalApplicants} active candidates</span> today.
                    </p>
                </div>
            </section>

            {/* Metric Grid */}
            <section className="grid gap-6 sm:grid-cols-3">
                <StatCard 
                    label="Total Positions" 
                    value={totalJobs} 
                    icon={<Briefcase className="text-blue-500" />} 
                    trend="+2 this week"
                />
                <StatCard 
                    label="Total Applicants" 
                    value={totalApplicants} 
                    icon={<Users className="text-emerald-500" />} 
                    trend="+12% growth"
                />
                <StatCard 
                    label="Avg. Engagement" 
                    value={`${avgApplicantsPerJob}`} 
                    subValue="per job"
                    icon={<TrendingUp className="text-purple-500" />} 
                    trend="High"
                />
            </section>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Recent Jobs List */}
                <section className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-slate-400" />
                            <h2 className="text-lg font-bold text-slate-900">Recently Posted</h2>
                        </div>
                        <Link href="/company/dashboard/manage-jobs" className="text-xs font-bold text-primary hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {recentJobs.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 italic">
                                No jobs posted yet. Start your first campaign!
                            </div>
                        ) : (
                            recentJobs.map((job) => (
                                <div key={job.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            {job.title[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</p>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-slate-900">{job.applications.length}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Applicants</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Quick Actions Sidebar */}
                <section className="space-y-4">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Operations</h2>
                    
                    <ActionCard 
                        href="/company/dashboard/post-job"
                        title="Post a New Job"
                        desc="Reach thousands of students instantly."
                        icon={<PlusCircle className="h-6 w-6 text-white" />}
                        bgColor="bg-primary"
                    />

                    <ActionCard 
                        href="/company/dashboard/manage-jobs"
                        title="Manage Listings"
                        desc="Edit, close or boost current posts."
                        icon={<Settings className="h-6 w-6 text-slate-600" />}
                        bgColor="bg-slate-100"
                        darkText
                    />
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, trend, subValue }: any) {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all duration-300 border border-transparent group-hover:border-slate-100">
                    {icon}
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">
                    {trend}
                </Badge>
            </div>
            <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                    {subValue && <span className="text-xs text-slate-400 font-medium">{subValue}</span>}
                </div>
            </div>
        </div>
    );
}

function ActionCard({ href, title, desc, icon, bgColor, darkText }: any) {
    return (
        <Link href={href} className="block group">
            <div className="p-6 rounded-[32px] bg-white border border-slate-200/60 shadow-sm hover:border-primary/50 transition-all relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className={`${bgColor} p-3 rounded-2xl shadow-lg shadow-primary/10`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className={`font-bold ${darkText ? 'text-slate-900' : 'text-slate-900'} group-hover:text-primary transition-colors`}>
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary ml-auto transition-all" />
                </div>
            </div>
        </Link>
    );
}