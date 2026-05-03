import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  Briefcase,
  ArrowUpRight,
  UserCog,
} from "lucide-react";

export default async function AdminUsersPage() {
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

  const allUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          resumes: true,
          applications: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter((usr) => usr.role === "ADMIN").length;
  const regularUsers = totalUsers - adminCount;
  const totalApplications = allUsers.reduce(
    (sum, usr) => sum + usr._count.applications,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="space-y-8 px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_20px_80px_rgba(15,23,42,0.20)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_28%)]" />

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
                  <UserCog className="h-3.5 w-3.5" />
                  Admin users
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  User management
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Review platform members, monitor account activity, and keep track
                  of resumes, applications, and admin access.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <HeroMiniStat
                  label="Users"
                  value={totalUsers}
                  icon={<Users className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Admins"
                  value={adminCount}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
                <HeroMiniStat
                  label="Applications"
                  value={totalApplications}
                  icon={<ArrowUpRight className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total users"
            value={totalUsers}
            icon={<Users className="h-5 w-5" />}
            hint="All registered accounts"
            tone="slate"
          />
          <StatsCard
            label="Admins"
            value={adminCount}
            icon={<ShieldCheck className="h-5 w-5" />}
            hint="Accounts with admin access"
            tone="rose"
          />
          <StatsCard
            label="Regular users"
            value={regularUsers}
            icon={<Mail className="h-5 w-5" />}
            hint="Standard platform members"
            tone="blue"
          />
          <StatsCard
            label="Applications"
            value={totalApplications}
            icon={<Briefcase className="h-5 w-5" />}
            hint="Total applications submitted"
            tone="emerald"
          />
        </section>

        {/* Users table */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">All users</h2>
              <p className="mt-1 text-sm text-slate-500">
                Platform users ordered by latest registration activity.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sorted by newest first
            </div>
          </div>

          {allUsers.length === 0 ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Resumes
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Applications
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((usr) => (
                    <tr
                      key={usr.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-bold text-violet-700 ring-1 ring-violet-200/70">
                            {usr.name?.[0]?.toUpperCase() ||
                              usr.email?.[0]?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {usr.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Platform member
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex max-w-[260px] items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{usr.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <RoleBadge role={usr.role} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                          <FileText className="h-4 w-4 text-slate-500" />
                          {usr._count.resumes}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                          <Briefcase className="h-4 w-4 text-slate-500" />
                          {usr._count.applications}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(usr.createdAt).toLocaleDateString()}
                        </div>
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
  tone: "slate" | "rose" | "blue" | "emerald";
}) {
  const styles = {
    slate: {
      iconBg: "bg-slate-100 text-slate-700",
      ring: "hover:ring-slate-200",
      live: "text-slate-600",
    },
    rose: {
      iconBg: "bg-rose-50 text-rose-600",
      ring: "hover:ring-rose-200",
      live: "text-rose-700",
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

function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") {
    return (
      <Badge className="rounded-full border-0 bg-rose-100 px-3 py-1 text-rose-700 hover:bg-rose-100">
        Admin
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">
      {role}
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Users className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">No users found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Registered users will appear here once accounts are created on the platform.
      </p>
    </div>
  );
}