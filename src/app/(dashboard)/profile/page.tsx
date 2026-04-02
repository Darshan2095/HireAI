import { currentUser } from "@/lib/current-user";
import { ProfileForm } from "@/features/dashboard/components/profile-form";

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <ProfileForm name={user?.name} />
    </div>
  );
}