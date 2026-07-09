"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, Megaphone, X } from "lucide-react";
import { secureFetch } from "@/lib/client-security";

type PartnerAdStatus = "draft" | "pending" | "approved" | "rejected";

type PartnerAd = {
  id: string;
  partnerId: string;
  partnerSlug: string;
  partnerName: string;
  title: string;
  description: string;
  placement: string;
  serviceType: string;
  city: string;
  budget: number;
  targetUrl: string;
  status: PartnerAdStatus;
  clicks: number;
  impressions: number;
  submittedAt: string;
  reviewNote?: string;
};

const labels: Record<PartnerAdStatus, string> = {
  draft: "مسودة",
  pending: "قيد المراجعة",
  approved: "منشور",
  rejected: "مرفوض",
};

const styles: Record<PartnerAdStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value) + " ر.س";
}

export function AdminPartnerAdsReview() {
  const [ads, setAds] = useState<PartnerAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const stats = useMemo(
    () => [
      { label: "بانتظار الموافقة", value: ads.filter((ad) => ad.status === "pending").length },
      { label: "منشورة", value: ads.filter((ad) => ad.status === "approved").length },
      { label: "مرفوضة", value: ads.filter((ad) => ad.status === "rejected").length },
      { label: "إجمالي الميزانيات", value: formatCurrency(ads.reduce((sum, ad) => sum + ad.budget, 0)) },
    ],
    [ads],
  );

  async function loadAds() {
    setLoading(true);
    const response = await fetch("/api/partner-ads?scope=admin", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as { data?: PartnerAd[] } | null;
    setAds(payload?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAds();
  }, []);

  async function reviewAd(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    const response = await secureFetch(`/api/partner-ads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        reviewNote: status === "rejected" ? "تم رفض الإعلان، يرجى تعديل المحتوى أو الميزانية وإعادة الإرسال." : "",
      }),
    });
    const payload = (await response.json().catch(() => null)) as { data?: PartnerAd } | null;
    if (response.ok && payload?.data) {
      setAds((items) => items.map((ad) => (ad.id === id ? (payload.data as PartnerAd) : ad)));
    }
    setBusyId("");
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black text-slate-400">{item.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">مراجعة إعلانات الشركاء</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">عند الموافقة يظهر الإعلان في صفحة الإعلانات العامة وصفحة الشريك التسويقية.</p>
          </div>
          <Link href="/ads" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-black">
            <ExternalLink className="size-4" />
            صفحة الإعلانات
          </Link>
        </div>

        <div className="grid gap-4 p-5">
          {loading ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">جاري تحميل الطلبات...</div> : null}
          {!loading && ads.length === 0 ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">لا توجد إعلانات للمراجعة.</div> : null}
          {ads.map((ad) => (
            <article key={ad.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[#FF385C]">
                      <Megaphone className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{ad.title}</h3>
                      <div className="mt-1 text-sm font-semibold text-slate-500">
                        {ad.partnerName} · {ad.placement} · {ad.serviceType} · {ad.city}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[ad.status]}`}>{labels[ad.status]}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{ad.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-slate-500">
                    <span className="rounded-full bg-white px-3 py-1">الميزانية: {formatCurrency(ad.budget)}</span>
                    <span className="rounded-full bg-white px-3 py-1">الظهور: {ad.impressions}</span>
                    <span className="rounded-full bg-white px-3 py-1">النقرات: {ad.clicks}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Link href={`/partners/${ad.partnerSlug}/ads`} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-black">
                    <ExternalLink className="size-4" />
                    صفحة الشريك
                  </Link>
                  <button
                    disabled={busyId === ad.id || ad.status === "approved"}
                    onClick={() => reviewAd(ad.id, "approved")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-black text-white disabled:opacity-50"
                  >
                    <Check className="size-4" />
                    موافقة ونشر
                  </button>
                  <button
                    disabled={busyId === ad.id || ad.status === "rejected"}
                    onClick={() => reviewAd(ad.id, "rejected")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-black text-red-700 disabled:opacity-50"
                  >
                    <X className="size-4" />
                    رفض
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
