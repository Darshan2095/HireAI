import { auth } from "@/lib/auth";
import { prisma } from "@/database/prisma";
import { redirect } from "next/navigation";
import PostJobForm from "@/components/company/PostJobForm";

type Props = { params: { slug: string } };

export default async function PostJobPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const name = decodeURIComponent(params.slug);
  const company = await prisma.company.findFirst({ where: { name } });
  if (!company) return <div className="p-6">Company not found</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Post a job for {company.name}</h1>
      {/* Client form */}
      <PostJobForm company={company.name} />
    </div>
  );
}
