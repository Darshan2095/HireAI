import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Briefcase,
  Building2,
  SearchCheck,
} from "lucide-react";
import type { ApplicationStatus } from "@prisma/client";

export default async function AdminApplicationsPage() {
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

  const allApplications = await prisma.application.findMany({
    include: {
      user: true,
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: allApplications.length,
    applied: allApplications.filter((a) => a.status === "APPLIED").length,
    inPipeline: allApplications.filter(
      (a) => a.status === "INTERVIEW" || a.status === "OFFER",
    ).length,
    rejected: allApplications.filter((a) => a.status === "REJECTED").length,
  };

  const pipelineRate =
    stats.total > 0 ? Math.round((stats.inPipeline / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="space-y-8 px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_20px_80px_rgba(15,23,42,0.20)]">
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
                  <SearchCheck className="h-3.5 w-3.5" />
                  Admin applications
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Application management
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Review every application, monitor approval flow, and keep hiring
                  activity visible across the platform.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <HeroMiniStat
                  label="Total"
                  value={stats.total}
                  icon={<FileText className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Interview / offer"
                  value={stats.inPipeline}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Pipeline rate"
                  value={`${pipelineRate}%`}
                  icon={<ArrowUpRight className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total applications"
            value={stats.total}
            icon={<FileText className="h-5 w-5" />}
            hint="All submitted applications"
            tone="slate"
          />
          <StatsCard
            label="Applied"
            value={stats.applied}
            icon={<Clock className="h-5 w-5" />}
            hint="Submitted, not yet advanced"
            tone="amber"
          />
          <StatsCard
            label="Interview / offer"
            value={stats.inPipeline}
            icon={<CheckCircle2 className="h-5 w-5" />}
            hint="Interview stage or offer extended"
            tone="emerald"
          />
          <StatsCard
            label="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            hint="Declined applications"
            tone="rose"
          />
        </section>

        {/* Table */}
        <section className="rounded-[28px] border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                All applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A complete list of job applications submitted on the platform.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sorted by latest activity
            </div>
          </div>

          {allApplications.length === 0 ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Job
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Applied date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-bold text-violet-700 ring-1 ring-violet-200/70">
                            {app.user.name?.[0]?.toUpperCase() ||
                              app.user.email?.[0]?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {app.user.name || "Unknown"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {app.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {app.job.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Briefcase className="h-3.5 w-3.5" />
                            Applied role
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span>{app.job.company}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function HeroMiniStat({
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

function StatsCard({
  label,
  value,
  icon,
  hint,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  hint: string;
  tone: "slate" | "amber" | "emerald" | "rose";
}) {
  const styles = {
    slate: {
      iconBg: "bg-slate-100 text-slate-700",
      ring: "hover:ring-slate-200",
      live: "text-slate-600",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600",
      ring: "hover:ring-amber-200",
      live: "text-amber-700",
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600",
      ring: "hover:ring-emerald-200",
      live: "text-emerald-700",
    },
    rose: {
      iconBg: "bg-rose-50 text-rose-600",
      ring: "hover:ring-rose-200",
      live: "text-rose-700",
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

        <span className={`text-xs font-semibold ${styles[tone].live}`}>Live</span>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === "OFFER") {
    return (
      <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
        Offer
      </Badge>
    );
  }

  if (status === "INTERVIEW") {
    return (
      <Badge className="rounded-full border-0 bg-violet-100 px-3 py-1 text-violet-700 hover:bg-violet-100">
        Interview
      </Badge>
    );
  }

  if (status === "REJECTED") {
    return (
      <Badge className="rounded-full border-0 bg-rose-100 px-3 py-1 text-rose-700 hover:bg-rose-100">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full border-0 bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-100">
      Applied
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <FileText className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No applications yet
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Applications will appear here once candidates start applying to posted jobs.
      </p>
    </div>
  );
}