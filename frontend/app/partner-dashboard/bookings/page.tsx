import { PartnerDashboardSuite } from "@/components/partners/partner-dashboard-suite";

export const metadata = {
  title: "حجوزات الشريك | لبيه",
};

export default function PartnerBookingsPage() {
  return <PartnerDashboardSuite section="bookings" />;
}
