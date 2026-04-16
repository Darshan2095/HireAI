import { currentUser } from "@/lib/current-user";
import { ProfileForm } from "@/features/dashboard/components/profile-form";

export default async function ProfilePage() {
  const user = await currentUser();
  const initialUsername =
    user && typeof user === "object" && "username" in user
      ? ((user.username as string | null | undefined) ?? null)
      : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <ProfileForm
        initialName={user?.name}
        initialUsername={initialUsername}
      />
    </div>
  );
}