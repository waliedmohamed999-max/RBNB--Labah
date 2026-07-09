import Link from "next/link";
import { ListingCard } from "@/components/ui/listing-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BridgeListing } from "@/lib/api";
import { featuredListings as fallbackListings } from "@/lib/site-data";
import { mapListingCard, SAUDI_RIYAL_SYMBOL } from "@/lib/presentation";

type FeaturedListingsSectionProps = {
  items?: BridgeListing[] | null;
  savedIds?: number[];
  isAuthenticated?: boolean;
  partnerAds?: Array<{
    id: string;
    title: string;
    description: string;
    partnerName: string;
    partnerSlug: string;
    serviceType: string;
    city: string;
  }>;
};

function formatFallbackPrice(value: string | number) {
  const amount = Number(String(value).replace(/,/g, ""));
  return `${Number.isFinite(amount) ? amount.toLocaleString("ar-SA") : value} ${SAUDI_RIYAL_SYMBOL}`;
}

export function FeaturedListingsSection({
  items,
  savedIds = [],
  isAuthenticated = false,
  partnerAds = [],
}: FeaturedListingsSectionProps) {
  const listings =
    items && items.length > 0
      ? items.slice(0, 6).map((item) => mapListingCard(item, savedIds))
      : fallbackListings.map((item, index) => ({
          listingId: index + 100,
          listingType: "home" as const,
          title: item.title,
          location: item.location,
          price: formatFallbackPrice(item.price),
          rating: item.rating,
          href: item.href,
          metadata: item.features,
          image: item.image,
          badge: "مختار",
          isSaved: false,
        }));

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="start"
            eyebrow="إعلانات مميزة"
            title="اختيارات جاهزة للحجز من بيانات المنصة"
            description="نعرض الإقامات والتجارب المميزة مباشرة من لوحة التحكم، مع إبراز السعر والموقع والتقييم وحالة العرض بوضوح."
          />
          <Link
            href="/ads"
            className="w-fit rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            عرض كل الإعلانات
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => (
            <ListingCard
              key={`${item.listingId}-${item.href}`}
              {...item}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        {partnerAds.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnerAds.slice(0, 3).map((ad) => (
              <Link
                key={ad.id}
                href={`/partners/${ad.partnerSlug}/ads`}
                className="rounded-lg border border-rose-100 bg-white p-5 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
              >
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-[#FF385C]">{ad.serviceType}</span>
                <h3 className="mt-4 line-clamp-1 text-lg font-black text-slate-950">{ad.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">{ad.description}</p>
                <div className="mt-4 text-xs font-black text-slate-400">{ad.partnerName} · {ad.city}</div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
