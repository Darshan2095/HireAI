import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  ArrowUpRight,
  Building2,
  BadgeCheck,
  CircleSlash2,
  GraduationCap,
} from "lucide-react";

export default async function AdminReportsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [
    totalUsers,
    totalJobs,
    totalApplications,
    totalResumes,
    usersByRole,
    applicationsByStatus,
    jobsByCompany,
    resumesByScore,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.resume.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
    prisma.job.groupBy({
      by: ["company"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    }),
    prisma.resume.groupBy({
      by: ["score"],
      _count: {
        id: true,
      },
      orderBy: {
        score: "desc",
      },
    }),
  ]);

  const userStats = usersByRole.map((stat) => ({
    role: stat.role,
    count: stat._count.id,
  }));

  const appStats = applicationsByStatus.map((stat) => ({
    status: stat.status,
    count: stat._count.id,
  }));

  const appTotals = {
    pending: appStats.find((s) => s.status === "APPLIED")?.count ?? 0,
    approved: appStats.find((s) => s.status === "OFFER")?.count ?? 0,
    rejected: appStats.find((s) => s.status === "REJECTED")?.count ?? 0,
  };

  const approvalRate =
    totalApplications > 0
      ? Math.round((appTotals.approved / totalApplications) * 100)
      : 0;

  const topCompanyCount = jobsByCompany[0]?._count.id ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="space-y-8 px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_20px_80px_rgba(15,23,42,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%)]" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Link
                  href="/dashboard/admin"
                  className="mb-5 inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/15"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Link>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Platform reports
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                  Platform analytics
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Monitor hiring activity, user composition, and resume quality
                  across the platform from one unified reporting view.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                <HeroStat
                  label="Users"
                  value={totalUsers}
                  icon={<Users className="h-4 w-4" />}
                />
                <HeroStat
                  label="Jobs"
                  value={totalJobs}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <HeroStat
                  label="Approval rate"
                  value={`${approvalRate}%`}
                  icon={<ArrowUpRight className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportMetric
            label="Total users"
            value={totalUsers}
            icon={<Users className="h-5 w-5" />}
            tone="blue"
            subtext="Registered accounts"
          />
          <ReportMetric
            label="Active jobs"
            value={totalJobs}
            icon={<Briefcase className="h-5 w-5" />}
            tone="emerald"
            subtext="Live listings"
          />
          <ReportMetric
            label="Applications"
            value={totalApplications}
            icon={<FileText className="h-5 w-5" />}
            tone="violet"
            subtext="Submitted applications"
          />
          <ReportMetric
            label="Resumes"
            value={totalResumes}
            icon={<TrendingUp className="h-5 w-5" />}
            tone="amber"
            subtext="Stored candidate profiles"
          />
        </section>

        {/* Report sections */}
        <section className="grid gap-6 xl:grid-cols-12">
          <ReportCard className="xl:col-span-4">
            <ReportHeader
              title="Users by role"
              icon={<Users className="h-5 w-5" />}
              meta={`${totalUsers} total users`}
            />

            <div className="mt-6 space-y-4">
              {userStats.length === 0 ? (
                <EmptyState
                  title="No role data"
                  description="User roles will appear here once accounts are created."
                />
              ) : (
                userStats.map((stat) => (
                  <ProgressRow
                    key={stat.role}
                    label={stat.role}
                    value={stat.count}
                    total={totalUsers}
                    accent="violet"
                  />
                ))
              )}
            </div>
          </ReportCard>

          <ReportCard className="xl:col-span-4">
            <ReportHeader
              title="Applications by status"
              icon={<BadgeCheck className="h-5 w-5" />}
              meta={`${totalApplications} total applications`}
            />

            <div className="mt-6 space-y-4">
              {appStats.length === 0 ? (
                <EmptyState
                  title="No application data"
                  description="Application status trends will show up once candidates start applying."
                />
              ) : (
                appStats.map((stat) => {
                  const accent =
                    stat.status === "OFFER"
                      ? "emerald"
                      : stat.status === "REJECTED"
                      ? "rose"
                      : "amber";

                  return (
                    <ProgressRow
                      key={stat.status}
                      label={stat.status}
                      value={stat.count}
                      total={totalApplications}
                      accent={accent}
                    />
                  );
                })
              )}
            </div>
          </ReportCard>

          <ReportCard className="xl:col-span-4">
            <ReportHeader
              title="Resume score distribution"
              icon={<GraduationCap className="h-5 w-5" />}
              meta={`${totalResumes} total resumes`}
            />

            <div className="mt-6 space-y-3">
              {resumesByScore.length === 0 ? (
                <EmptyState
                  title="No resume scores"
                  description="Score distribution will appear once resumes are evaluated."
                />
              ) : (
                resumesByScore.map((score) => (
                  <div
                    key={String(score.score)}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 transition hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {score.score ?? "Not scored"}
                      </p>
                      <p className="text-xs text-slate-500">Resume score bucket</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                      {score._count.id}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </ReportCard>
        </section>

        {/* Companies */}
        <ReportCard>
          <ReportHeader
            title="Top companies by job postings"
            icon={<Building2 className="h-5 w-5" />}
            meta={
              topCompanyCount > 0
                ? `${jobsByCompany.length} companies with jobs`
                : "No company data yet"
            }
          />

          <div className="mt-6 space-y-3">
            {jobsByCompany.length === 0 ? (
              <EmptyState
                title="No companies yet"
                description="Company rankings will appear after jobs are posted."
              />
            ) : (
              jobsByCompany.map((company, idx) => (
                <div
                  key={`${company.company}-${idx}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 transition hover:bg-white"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                      {idx + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {company.company}
                      </p>
                      <p className="text-xs text-slate-500">Company job postings</p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                    {company._count.id} jobs
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ReportCard>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-300">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <p className="text-xl font-black tracking-tight text-white">{value}</p>
    </div>
  );
}

function ReportMetric({
  label,
  value,
  icon,
  tone,
  subtext,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "emerald" | "violet" | "amber";
  subtext: string;
}) {
  const styles = {
    blue: {
      iconBg: "bg-blue-50 text-blue-600",
      ring: "hover:ring-blue-200",
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600",
      ring: "hover:ring-emerald-200",
    },
    violet: {
      iconBg: "bg-violet-50 text-violet-600",
      ring: "hover:ring-violet-200",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600",
      ring: "hover:ring-amber-200",
    },
  };

  return (
    <div
      className={`rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-transparent transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles[tone].ring}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles[tone].iconBg}`}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500">Live</span>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

function ReportCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function ReportHeader({
  title,
  icon,
  meta,
}: {
  title: string;
  icon: React.ReactNode;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {meta ? <p className="mt-1 text-xs text-slate-500">{meta}</p> : null}
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  accent,
}: {
  label: string;
  value: number;
  total: number;
  accent: "emerald" | "rose" | "amber" | "violet";
}) {
  const barClass = {
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
  };

  const percent = total > 0 ? Math.max(6, Math.round((value / total) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold capitalize text-slate-900">
            {label}
          </p>
          <p className="text-xs text-slate-500">{value} records</p>
        </div>
        <span className="text-sm font-black text-slate-950">{percent}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${barClass[accent]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <CircleSlash2 className="h-5 w-5 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}