import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { PartnerRegistrationForm } from "@/components/partners/partner-registration-form";
import { partnerFeatureCards } from "@/lib/partner-system-demo";

export const metadata = {
  title: "تسجيل الشركاء | لبيه",
};

export default function PartnerRegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 text-slate-950 sm:px-6 lg:px-10" dir="rtl">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
            <ArrowRight className="size-4" />
            العودة للرئيسية
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">
              <Truck className="size-4 text-[#FF385C]" />
              Partner Portal
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              <ShieldCheck className="size-4" />
              تحقق وصلاحيات قبل التفعيل
            </span>
          </div>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partnerFeatureCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#FF385C]/10 text-[#FF385C]">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-black text-slate-800">{item.label}</span>
              </div>
            );
          })}
        </section>

        <PartnerRegistrationForm />
      </div>
    </main>
  );
}
