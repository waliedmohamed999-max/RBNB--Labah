"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, Megaphone, Send, XCircle } from "lucide-react";
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
  imageUrl: string;
  status: PartnerAdStatus;
  clicks: number;
  impressions: number;
  submittedAt: string;
  reviewNote?: string;
};

type PartnerAdsManagerProps = {
  partner: {
    id: string;
    slug: string;
    company: string;
    city: string;
  };
  serviceTypes: string[];
};

const statusMeta: Record<PartnerAdStatus, { label: string; className: string; icon: typeof Clock3 }> = {
  draft: { label: "مسودة", className: "bg-slate-100 text-slate-700", icon: Clock3 },
  pending: { label: "بانتظار الموافقة", className: "bg-amber-50 text-amber-700", icon: Clock3 },
  approved: { label: "منشور", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "مرفوض", className: "bg-red-50 text-red-700", icon: XCircle },
};

const placements = ["واجهة البحث", "الصفحة الرئيسية", "نتائج الفعاليات", "صفحة التجارب", "عروض سريعة"];
const cities = ["الرياض", "جدة", "الدمام", "الخبر", "مكة", "المدينة", "أبها"];

function StatusBadge({ status }: { status: PartnerAdStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${meta.className}`}>
      <Icon className="size-3.5" />
      {meta.label}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value) + " ر.س";
}

export function PartnerAdsManager({ partner, serviceTypes }: PartnerAdsManagerProps) {
  const [ads, setAds] = useState<PartnerAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    placement: placements[0],
    serviceType: serviceTypes[0] ?? "شاليهات وفلل",
    city: partner.city,
    budget: "1500",
    targetUrl: `/partners/${partner.slug}/ads`,
  });

  const publicUrl = `/partners/${partner.slug}/ads`;
  const approvedCount = useMemo(() => ads.filter((ad) => ad.status === "approved").length, [ads]);
  const pendingCount = useMemo(() => ads.filter((ad) => ad.status === "pending").length, [ads]);

  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      const response = await fetch(`/api/partner-ads?scope=partner&partnerId=${encodeURIComponent(partner.id)}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: PartnerAd[] } | null;
      setAds(payload?.data ?? []);
      setLoading(false);
    }

    loadAds();
  }, [partner.id]);

  async function submitAd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await secureFetch("/api/partner-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budget: Number(form.budget),
        partnerId: partner.id,
        partnerSlug: partner.slug,
        partnerName: partner.company,
      }),
    });

    const payload = (await response.json().catch(() => null)) as { data?: PartnerAd; message?: string } | null;
    if (!response.ok || !payload?.data) {
      setMessage(payload?.message ?? "تعذر إرسال الإعلان للمراجعة.");
    } else {
      setAds((items) => [payload.data as PartnerAd, ...items]);
      setForm((current) => ({ ...current, title: "", description: "", budget: "1500" }));
      setMessage("تم إرسال الإعلان للأدمن، وسيظهر في المنصة فور الموافقة.");
    }

    setSaving(false);
  }

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <form onSubmit={submitAd} className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-[#FF385C]/10 text-[#FF385C]">
            <Megaphone className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-black">إعلان جديد</h2>
            <div className="mt-1 text-sm font-semibold text-slate-500">يرسل للمراجعة ثم ينشر مباشرة بعد الموافقة.</div>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            عنوان الإعلان
            <input
              required
              minLength={4}
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-[#FF385C]"
            />
          </label>
          <label className="grid gap-2 text-sm font-black text-slate-700">
            وصف مختصر
            <textarea
              required
              minLength={10}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="min-h-28 rounded-lg border border-slate-200 p-3 outline-none focus:border-[#FF385C]"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              مكان الظهور
              <select
                value={form.placement}
                onChange={(event) => setForm((current) => ({ ...current, placement: event.target.value }))}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-[#FF385C]"
              >
                {placements.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              القسم
              <select
                value={form.serviceType}
                onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-[#FF385C]"
              >
                {serviceTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              المدينة
              <select
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-[#FF385C]"
              >
                {cities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              الميزانية
              <input
                required
                min={100}
                type="number"
                value={form.budget}
                onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
                className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-[#FF385C]"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-black text-slate-700">
            رابط التحويل
            <input
              required
              value={form.targetUrl}
              onChange={(event) => setForm((current) => ({ ...current, targetUrl: event.target.value }))}
              className="h-11 rounded-lg border border-slate-200 px-3 outline-none focus:border-[#FF385C]"
            />
          </label>
        </div>

        {message ? <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</div> : null}

        <button
          disabled={saving}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white disabled:opacity-60"
        >
          <Send className="size-4" />
          {saving ? "جار الإرسال" : "إرسال للمراجعة"}
        </button>
      </form>

      <div className="grid gap-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">إعلانات {partner.company}</h2>
              <div className="mt-1 text-sm font-semibold text-slate-500">{approvedCount} منشور · {pendingCount} بانتظار الموافقة</div>
            </div>
            <Link href={publicUrl} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-black">
              <ExternalLink className="size-4" />
              صفحة التسويق
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {loading ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">جاري تحميل الإعلانات...</div> : null}
            {!loading && ads.length === 0 ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">لا توجد إعلانات بعد.</div> : null}
            {ads.map((ad) => (
              <article key={ad.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-black text-slate-950">{ad.title}</h3>
                    <div className="mt-1 text-sm font-semibold text-slate-500">{ad.placement} · {ad.serviceType}</div>
                  </div>
                  <StatusBadge status={ad.status} />
                </div>
                <p className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">{ad.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">النقرات</div>
                    <div className="mt-1 font-black">{ad.clicks}</div>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">الظهور</div>
                    <div className="mt-1 font-black">{ad.impressions}</div>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <div className="text-xs font-bold text-slate-400">الميزانية</div>
                    <div className="mt-1 font-black">{formatCurrency(ad.budget)}</div>
                  </div>
                </div>
                {ad.reviewNote ? <div className="mt-3 text-xs font-bold text-red-600">{ad.reviewNote}</div> : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
