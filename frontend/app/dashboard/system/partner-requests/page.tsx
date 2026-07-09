import { redirect } from "next/navigation";

export default function DashboardPartnerRequestsPage() {
  redirect("/dashboard/partners?tab=requests");
}
