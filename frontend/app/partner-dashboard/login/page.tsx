import { Suspense } from "react";
import { PartnerLoginForm } from "@/components/partners/partner-login-form";

export default function PartnerDashboardLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] p-4">
      <Suspense fallback={<div className="text-sm font-bold text-slate-500">جاري التحميل...</div>}>
        <PartnerLoginForm />
      </Suspense>
    </main>
  );
}
