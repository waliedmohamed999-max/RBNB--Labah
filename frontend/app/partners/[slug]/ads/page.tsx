import Link from "next/link";
import { ArrowLeft, CalendarCheck2, MapPin, Megaphone, Sparkles } from "lucide-react";
import { listPublicAds } from "@/lib/partner-ads-store";

export const dynamic = "force-dynamic";

type PartnerAdsPageProps = {
  params: Promise<{ slug: string }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value) + " ر.س";
}

export async function generateMetadata({ params }: PartnerAdsPageProps) {
  const { slug } = await params;
  const ads = await listPublicAds(slug);
  const partnerName = ads[0]?.partnerName ?? "الشريك";
  return { title: `${partnerName} | إعلانات الشريك` };
}

export default async function PartnerPublicAdsPage({ params }: PartnerAdsPageProps) {
  const { slug } = await params;
  const ads = await listPublicAds(slug);
  const partnerName = ads[0]?.partnerName ?? "شريك لبيه";
  const cities = Array.from(new Set(ads.map((ad) => ad.city)));
  const serviceTypes = Array.from(new Set(ads.map((ad) => ad.serviceType)));

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950" dir="rtl">
      <section className="bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/ads" className="inline-flex items-center gap-2 text-sm font-black text-white/70 hover:text-white">
            <ArrowLeft className="size-4 rotate-180" />
            كل الإعلانات
          </Link>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/75">
                <Megaphone className="size-4 text-[#FF385C]" />
                صفحة تسويق الشريك
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight">{partnerName}</h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/70">
                صفحة عامة تجمع إعلانات الشريك المعتمدة وتصلح كرابط تسويقي مباشر للخدمات والعروض داخل منصة لبيه.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">الإعلانات</div>
                <div className="mt-2 text-2xl font-black">{ads.length}</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">الأقسام</div>
                <div className="mt-2 text-2xl font-black">{serviceTypes.length}</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">المدن</div>
                <div className="mt-2 text-2xl font-black">{cities.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((type) => (
            <span key={type} className="rounded-full bg-[#FF385C]/10 px-3 py-1 text-xs font-black text-[#FF385C]">{type}</span>
          ))}
          {cities.map((city) => (
            <span key={city} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
              <MapPin className="size-3" />
              {city}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {ads.map((ad) => (
            <article key={ad.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Sparkles className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  <CalendarCheck2 className="size-3" />
                  متاح الآن
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">{ad.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{ad.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-400">القسم</div>
                  <div className="mt-1 font-black">{ad.serviceType}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-400">المدينة</div>
                  <div className="mt-1 font-black">{ad.city}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-400">الميزانية</div>
                  <div className="mt-1 font-black">{formatCurrency(ad.budget)}</div>
                </div>
              </div>
              <Link href={ad.targetUrl} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white">
                فتح العرض
                <ArrowLeft className="size-4" />
              </Link>
            </article>
          ))}
        </div>

        {ads.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">لا توجد إعلانات منشورة لهذا الشريك حاليا.</div>
        ) : null}
      </section>
    </main>
  );
}
