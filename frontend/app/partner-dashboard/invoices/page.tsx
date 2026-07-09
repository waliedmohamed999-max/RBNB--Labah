import { PartnerDashboardSuite } from "@/components/partners/partner-dashboard-suite";

export const metadata = {
  title: "فواتير الشريك | لبيه",
};

export default function PartnerInvoicesPage() {
  return <PartnerDashboardSuite section="invoices" />;
}
