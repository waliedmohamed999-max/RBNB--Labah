import Link from "next/link";
import { ArrowLeft, MapPin, Megaphone, MousePointerClick, Sparkles } from "lucide-react";
import { listPublicAds } from "@/lib/partner-ads-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إعلانات الشركاء | لبيه",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value) + " ر.س";
}

export default async function PublicAdsPage() {
  const ads = await listPublicAds();

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950" dir="rtl">
      <section className="bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/75">
            <Megaphone className="size-4 text-[#FF385C]" />
            إعلانات الشركاء المعتمدة
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight">عروض وخدمات منشورة من شركاء لبيه</h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/70">
                كل إعلان هنا تمت مراجعته من لوحة التحكم، ويظهر تلقائيا بعد موافقة الأدمن.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">الإعلانات المنشورة</div>
                <div className="mt-2 text-2xl font-black">{ads.length}</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">الشركاء</div>
                <div className="mt-2 text-2xl font-black">{new Set(ads.map((ad) => ad.partnerId)).size}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 md:grid-cols-2 xl:grid-cols-3">
        {ads.map((ad) => (
          <article key={ad.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-lg bg-[#FF385C]/10 text-[#FF385C]">
                <Sparkles className="size-5" />
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">منشور</span>
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-950">{ad.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">{ad.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-400">الشريك</div>
                <div className="mt-1 font-black">{ad.partnerName}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-400">القسم</div>
                <div className="mt-1 font-black">{ad.serviceType}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                <MapPin className="size-3" />
                {ad.city}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                <MousePointerClick className="size-3" />
                {ad.clicks} نقرة
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1">{formatCurrency(ad.budget)}</span>
            </div>
            <Link href={`/partners/${ad.partnerSlug}/ads`} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white">
              عرض صفحة الشريك
              <ArrowLeft className="size-4" />
            </Link>
          </article>
        ))}
        {ads.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">لا توجد إعلانات منشورة حاليا.</div>
        ) : null}
      </section>
    </main>
  );
}
