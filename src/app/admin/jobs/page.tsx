import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Clock,
  Building2,
  FileText,
  ArrowUpRight,
} from "lucide-react";

export default async function AdminJobsPage() {
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

  const allJobs = await prisma.job.findMany({
    include: {
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalApplications = allJobs.reduce(
    (sum, job) => sum + job.applications.length,
    0
  );

  const avgApplications =
    allJobs.length > 0 ? Math.round(totalApplications / allJobs.length) : 0;

  const recentJobs = allJobs.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="space-y-8 px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_20px_80px_rgba(15,23,42,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)]" />

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
                  <Briefcase className="h-3.5 w-3.5" />
                  Job management
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Manage posted jobs
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Review job listings, monitor application volume, and keep the
                  platform’s hiring activity organized.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <HeroMiniStat
                  label="Jobs"
                  value={allJobs.length}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Apps"
                  value={totalApplications}
                  icon={<Users className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Avg/job"
                  value={avgApplications}
                  icon={<ArrowUpRight className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total jobs"
            value={allJobs.length}
            icon={<Briefcase className="h-5 w-5" />}
            hint="All active and archived listings"
            tone="slate"
          />
          <StatsCard
            label="Total applications"
            value={totalApplications}
            icon={<FileText className="h-5 w-5" />}
            hint="Across every job"
            tone="blue"
          />
          <StatsCard
            label="Average per job"
            value={avgApplications}
            icon={<Users className="h-5 w-5" />}
            hint="Application density"
            tone="emerald"
          />
          <StatsCard
            label="Recent jobs"
            value={recentJobs.length}
            icon={<Clock className="h-5 w-5" />}
            hint="Latest items visible"
            tone="amber"
          />
        </section>

        {/* Jobs table */}
        <section className="rounded-[28px] border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                All jobs
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View every posted role with application counts and creation date.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Sorted by latest posted
            </div>
          </div>

          {allJobs.length === 0 ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Job title
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Applications
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Posted
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {job.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Job listing
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span>{job.company}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {job.applications.length}
                            </p>
                            <p className="text-xs text-slate-500">Applications</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="line-clamp-2 max-w-md text-sm leading-6 text-slate-600">
                          {job.description}
                        </p>
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
  tone: "slate" | "blue" | "emerald" | "amber";
}) {
  const styles = {
    slate: {
      iconBg: "bg-slate-100 text-slate-700",
      ring: "hover:ring-slate-200",
      live: "text-slate-600",
    },
    blue: {
      iconBg: "bg-blue-50 text-blue-600",
      ring: "hover:ring-blue-200",
      live: "text-blue-700",
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600",
      ring: "hover:ring-emerald-200",
      live: "text-emerald-700",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600",
      ring: "hover:ring-amber-200",
      live: "text-amber-700",
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
        <span className={`text-xs font-semibold ${styles[tone].live}`}>
          Live
        </span>
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Briefcase className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No jobs posted yet
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Once jobs are created, they will appear here with application counts and posting dates.
      </p>
    </div>
  );
}