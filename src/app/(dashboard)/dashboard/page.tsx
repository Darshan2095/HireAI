import { currentUser } from "@/lib/current-user";
import { Welcome } from "@/features/dashboard/components/welcome";
import { StatsCards } from "@/features/dashboard/components/stats-cards";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <Welcome name={user?.name} />
      <StatsCards />
    </div>
  );
}