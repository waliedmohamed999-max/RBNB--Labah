import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileManager } from "@/components/dashboard/profile-manager";
import { getProfile, getSessionUser } from "@/lib/api";

export default async function DashboardProfilePage() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") ?? "";
  const [currentUser, profile] = await Promise.all([
    getSessionUser(cookieHeader),
    getProfile(cookieHeader),
  ]);

  if (!currentUser) {
    redirect("/auth/login?return_url=/dashboard/profile");
  }

  if (!profile) {
    return null;
  }

  return <ProfileManager profile={profile} />;
}
