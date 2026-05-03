import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateCompanyForm from "@/components/company/CreateCompanyForm";

export default async function NewCompanyPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Create a company</h1>
      <CreateCompanyForm />
    </div>
  );
}
