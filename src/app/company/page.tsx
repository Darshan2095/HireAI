import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function CompanyIndexPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  // companies created with company.email set to the creator's email
  const companies = await prisma.company.findMany({
    where: { email: session.user.email },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Company Dashboard</h1>
        <Link href="/company/new">
          <Button>New company</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {companies.length === 0 ? (
          <div className="rounded-xl border p-6">You have not created any companies yet.</div>
        ) : (
          companies.map((c) => (
            <div key={c.id} className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <p className="text-sm text-muted-foreground">{c.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{new Date(c.createdAt).toLocaleDateString()}</Badge>
                <Link href={`/company/${encodeURIComponent(c.name)}`} className="inline-flex items-center gap-1">
                  <Button variant="outline" size="sm">Open <ArrowRight size={14}/></Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
