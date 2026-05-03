import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  ChevronRight,
  Activity,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  UserPlus,
  Building2,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalResumes,
    recentUsers,
    recentJobs,
    recentApplications,
    jobStats,
    applicationStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        resumeScore: null,
      },
    }),
    prisma.job.count(),
    prisma.application.count(),
    prisma.resume.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.job.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        applications: true,
      },
    }),
    prisma.application.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: true,
        user: true,
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
      take: 5,
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
  ]);

  const statusMap = {
    PENDING: applicationStats.find((s) => s.status === "PENDING")?._count.id ?? 0,
    APPROVED: applicationStats.find((s) => s.status === "APPROVED")?._count.id ?? 0,
    REJECTED: applicationStats.find((s) => s.status === "REJECTED")?._count.id ?? 0,
  };

  const approvalRate =
    totalApplications > 0
      ? Math.round((statusMap.APPROVED / totalApplications) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="space-y-8 px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_20px_80px_rgba(15,23,42,0.28)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_28%)]" />
          <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Control Center
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Platform overview
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Track platform activity, review applications, monitor hiring flow,
                  and manage users from one clear dashboard.
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
                  icon={<Sparkles className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Total Users"
            value={totalUsers}
            icon={<Users className="h-5 w-5" />}
            hint="Registered accounts"
            tone="blue"
          />
          <MetricCard
            label="Companies"
            value={totalCompanies}
            icon={<Building2 className="h-5 w-5" />}
            hint="Employers on platform"
            tone="emerald"
          />
          <MetricCard
            label="Active Jobs"
            value={totalJobs}
            icon={<Briefcase className="h-5 w-5" />}
            hint="Currently listed roles"
            tone="amber"
          />
          <MetricCard
            label="Applications"
            value={totalApplications}
            icon={<TrendingUp className="h-5 w-5" />}
            hint="Submitted by candidates"
            tone="violet"
          />
          <MetricCard
            label="Resumes"
            value={totalResumes}
            icon={<Activity className="h-5 w-5" />}
            hint="Candidate profiles"
            tone="pink"
          />
        </section>

        {/* Status + Companies + Actions */}
        <section className="grid gap-6 xl:grid-cols-12">
          <DashboardCard className="xl:col-span-4">
            <SectionHeader
              title="Application status"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <div className="mt-6 space-y-3">
              <StatusRow
                label="Pending"
                value={statusMap.PENDING}
                icon={<Clock className="h-4 w-4 text-amber-500" />}
                color="amber"
              />
              <StatusRow
                label="Approved"
                value={statusMap.APPROVED}
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                color="emerald"
              />
              <StatusRow
                label="Rejected"
                value={statusMap.REJECTED}
                icon={<XCircle className="h-4 w-4 text-rose-500" />}
                color="rose"
              />
            </div>
          </DashboardCard>

          <DashboardCard className="xl:col-span-4">
            <SectionHeader
              title="Top companies"
              icon={<Building2 className="h-5 w-5" />}
            />

            <div className="mt-6 space-y-3">
              {jobStats.length === 0 ? (
                <EmptyState text="No companies yet" />
              ) : (
                jobStats.map((company, idx) => (
                  <div
                    key={`${company.company}-${idx}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 transition hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {company.company}
                      </p>
                      <p className="text-xs text-slate-500">Company jobs posted</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1">
                      {company._count.id}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="xl:col-span-4">
            <SectionHeader
              title="Quick actions"
              icon={<ArrowUpRight className="h-5 w-5" />}
            />

            <div className="mt-6 space-y-3">
              <AdminActionButton
                href="/admin/users"
                icon={<Users className="h-4.5 w-4.5" />}
                label="Manage users"
                description="Review accounts and roles"
              />
              <AdminActionButton
                href="/admin/jobs"
                icon={<Briefcase className="h-4.5 w-4.5" />}
                label="View jobs"
                description="Inspect all active listings"
              />
              <AdminActionButton
                href="/admin/applications"
                icon={<ClipboardList className="h-4.5 w-4.5" />}
                label="Review applications"
                description="Track candidate progress"
              />
              <AdminActionButton
                href="/admin/reports"
                icon={<BarChart3 className="h-4.5 w-4.5" />}
                label="Open reports"
                description="View platform insights"
              />
            </div>
          </DashboardCard>
        </section>

        {/* Recent users and jobs */}
        <section className="grid gap-6 xl:grid-cols-2">
          <DashboardCard>
            <SectionHeader
              title="Recent users"
              icon={<UserPlus className="h-5 w-5" />}
              href="/admin/users"
              hrefLabel="View all"
            />

            <div className="mt-6 divide-y divide-slate-100">
              {recentUsers.length === 0 ? (
                <EmptyState text="No users yet" />
              ) : (
                recentUsers.map((usr) => (
                  <div
                    key={usr.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-bold text-violet-700 ring-1 ring-violet-200/70">
                        {usr.name?.[0]?.toUpperCase() || usr.email?.[0]?.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {usr.name || "Unknown"}
                        </p>
                        <p className="truncate text-xs text-slate-500">{usr.email}</p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        usr.role === "ADMIN"
                          ? "rounded-full border-red-200 bg-red-50 text-red-700"
                          : "rounded-full"
                      }
                    >
                      {usr.role}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader
              title="Recent jobs"
              icon={<Briefcase className="h-5 w-5" />}
              href="/admin/jobs"
              hrefLabel="View all"
            />

            <div className="mt-6 space-y-4">
              {recentJobs.length === 0 ? (
                <EmptyState text="No jobs posted yet" />
              ) : (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {job.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">{job.company}</p>
                      </div>

                      <Badge variant="secondary" className="rounded-full">
                        {job.applications.length} apps
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </section>

        {/* Recent applications */}
        <DashboardCard className="overflow-hidden">
          <SectionHeader
            title="Recent applications"
            icon={<FileText className="h-5 w-5" />}
            href="/admin/applications"
            hrefLabel="View all"
          />

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50/80 text-left">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Job title
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Company
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10">
                      <EmptyState text="No applications yet" />
                    </td>
                  </tr>
                ) : (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {app.user.name || "Unknown"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {app.user.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-800">
                        {app.job.title}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {app.job.company}
                      </td>

                      <td className="px-4 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  hint: string;
  tone: "blue" | "emerald" | "amber" | "violet" | "pink";
}

function MetricCard({ label, value, icon, hint, tone }: MetricCardProps) {
  const styles = {
    blue: {
      ring: "ring-blue-200/70",
      iconBg: "bg-blue-50 text-blue-600",
      chip: "text-blue-700",
    },
    emerald: {
      ring: "ring-emerald-200/70",
      iconBg: "bg-emerald-50 text-emerald-600",
      chip: "text-emerald-700",
    },
    amber: {
      ring: "ring-amber-200/70",
      iconBg: "bg-amber-50 text-amber-600",
      chip: "text-amber-700",
    },
    violet: {
      ring: "ring-violet-200/70",
      iconBg: "bg-violet-50 text-violet-600",
      chip: "text-violet-700",
    },
    pink: {
      ring: "ring-pink-200/70",
      iconBg: "bg-pink-50 text-pink-600",
      chip: "text-pink-700",
    },
  };

  return (
    <div
      className={`group rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-transparent transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles[tone].ring}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles[tone].iconBg}`}
        >
          {icon}
        </div>

        <span className={`text-xs font-semibold ${styles[tone].chip}`}>
          Live
        </span>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <span className="text-3xl font-black tracking-tight text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-500">{hint}</p>
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

function DashboardCard({
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

function SectionHeader({
  title,
  icon,
  href,
  hrefLabel,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
        </div>
      </div>

      {href && hrefLabel ? (
        <Link
          href={href}
          className="text-xs font-bold text-violet-600 transition hover:text-violet-700 hover:underline"
        >
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}

function StatusRow({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "emerald" | "rose";
}) {
  const barStyles = {
    amber: "from-amber-400 to-amber-500 bg-amber-50",
    emerald: "from-emerald-400 to-emerald-500 bg-emerald-50",
    rose: "from-rose-400 to-rose-500 bg-rose-50",
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          {icon}
          {label}
        </div>
        <span className="text-lg font-black text-slate-950">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full w-full rounded-full bg-gradient-to-r ${barStyles[color]}`}
          style={{
            width: `${Math.max(12, Math.min(100, value === 0 ? 12 : value))}%`,
          }}
        />
      </div>
    </div>
  );
}

function ApplicationStatusBadge({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  if (status === "APPROVED") {
    return (
      <Badge className="rounded-full border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Approved
      </Badge>
    );
  }

  if (status === "REJECTED") {
    return (
      <Badge className="rounded-full border-0 bg-rose-100 text-rose-700 hover:bg-rose-100">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full border-0 bg-amber-100 text-amber-700 hover:bg-amber-100">
      Pending
    </Badge>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <AlertIcon />
      </div>
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

function AlertIcon() {
  return <FileText className="h-5 w-5 text-slate-400" />;
}

interface AdminActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

function AdminActionButton({
  href,
  icon,
  label,
  description,
}: AdminActionButtonProps) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-violet-200 hover:bg-violet-50/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition group-hover:text-violet-600">
          {icon}
        </div>

        <div className="min-w-0 text-left">
          <p className="text-sm font-semibold text-slate-900 transition group-hover:text-violet-700">
            {label}
          </p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
    </Link>
  );
}