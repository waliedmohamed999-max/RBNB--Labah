import { AdminPartnersConsole } from "@/components/partners/admin-partners-console";

export const metadata = {
  title: "الشركاء والباقات | لوحة التحكم",
};

type DashboardPartnersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPartnersPage({ searchParams }: DashboardPartnersPageProps) {
  const params = (await searchParams) ?? {};
  const tab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const safeTab = tab === "partners" || tab === "packages" || tab === "permissions" || tab === "ads" ? tab : "requests";

  return <AdminPartnersConsole initialTab={safeTab} />;
}
