import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobList from "@/components/company/JobList";

type Props = {
  params: { slug: string };
};

export default async function CompanyPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const name = decodeURIComponent(params.slug);

  const company = await prisma.company.findFirst({ where: { name } });
  if (!company) return <div className="p-6">Company not found</div>;

  const jobs = await prisma.job.findMany({ where: { company: company.name }, orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-muted-foreground">Owner: {company.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{jobs.length} jobs</Badge>
          <Link href={`/company/${encodeURIComponent(company.name)}/post-job`}>
            <Button>Post job</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="rounded-xl border p-6">No jobs for this company yet.</div>
        ) : (
          <JobList initialJobs={jobs} company={company.name} />
        )}
      </div>
    </div>
  );
}
