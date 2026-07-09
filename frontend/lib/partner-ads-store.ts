import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export type PartnerAdStatus = "draft" | "pending" | "approved" | "rejected";

export type PartnerAd = {
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
  reviewedAt?: string;
  reviewNote?: string;
};

type PartnerAdsStore = {
  ads: PartnerAd[];
};

export type PartnerAdInput = {
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
  imageUrl?: string;
};

const storePath = path.join(process.cwd(), "storage", "partner-ads.json");

const defaultStore: PartnerAdsStore = {
  ads: [
    {
      id: "ad-001",
      partnerId: "ptr-001",
      partnerSlug: "montaja-rawafed",
      partnerName: "منتجع روافد",
      title: "عرض نهاية الأسبوع في منتجع روافد",
      description: "إقامة عائلية مع جلسة خارجية وتجهيز كامل للضيافة في الرياض.",
      placement: "واجهة البحث",
      serviceType: "شاليهات وفلل",
      city: "الرياض",
      budget: 3500,
      targetUrl: "/partners/montaja-rawafed/ads",
      imageUrl: "/images/labayh-logo.svg",
      status: "approved",
      clicks: 2840,
      impressions: 48200,
      submittedAt: "2026-04-26T09:30:00.000Z",
      reviewedAt: "2026-04-26T12:10:00.000Z",
    },
    {
      id: "ad-002",
      partnerId: "ptr-001",
      partnerSlug: "montaja-rawafed",
      partnerName: "منتجع روافد",
      title: "تمييز خدمات المؤتمرات",
      description: "قاعة مجهزة للاجتماعات والمؤتمرات مع تنسيق الضيافة والتقنية.",
      placement: "نتائج الفعاليات",
      serviceType: "فعاليات ومؤتمرات",
      city: "الرياض",
      budget: 1200,
      targetUrl: "/partners/montaja-rawafed/ads",
      imageUrl: "/images/labayh-logo.svg",
      status: "pending",
      clicks: 0,
      impressions: 0,
      submittedAt: "2026-05-01T15:15:00.000Z",
    },
  ],
};

async function ensureStoreDir() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
}

export async function readPartnerAdsStore(): Promise<PartnerAdsStore> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<PartnerAdsStore>;
    return {
      ads: Array.isArray(parsed.ads) ? parsed.ads : defaultStore.ads,
    };
  } catch {
    return defaultStore;
  }
}

export async function writePartnerAdsStore(next: PartnerAdsStore) {
  await ensureStoreDir();
  await fs.writeFile(storePath, JSON.stringify(next, null, 2), "utf8");
}

export async function listPartnerAds(partnerId?: string) {
  const store = await readPartnerAdsStore();
  return partnerId ? store.ads.filter((ad) => ad.partnerId === partnerId) : store.ads;
}

export async function listPublicAds(partnerSlug?: string) {
  const store = await readPartnerAdsStore();
  return store.ads.filter((ad) => ad.status === "approved" && (!partnerSlug || ad.partnerSlug === partnerSlug));
}

export async function createPartnerAd(input: PartnerAdInput) {
  const store = await readPartnerAdsStore();
  const now = new Date().toISOString();
  const ad: PartnerAd = {
    ...input,
    id: `ad-${crypto.randomUUID().slice(0, 8)}`,
    budget: Math.max(0, Math.round(input.budget)),
    imageUrl: input.imageUrl || "/images/labayh-logo.svg",
    status: "pending",
    clicks: 0,
    impressions: 0,
    submittedAt: now,
  };

  await writePartnerAdsStore({ ads: [ad, ...store.ads] });
  return ad;
}

export async function updatePartnerAdStatus(id: string, status: PartnerAdStatus, reviewNote = "") {
  const store = await readPartnerAdsStore();
  let updated: PartnerAd | null = null;
  const ads = store.ads.map((ad) => {
    if (ad.id !== id) return ad;
    updated = {
      ...ad,
      status,
      reviewNote,
      reviewedAt: new Date().toISOString(),
      impressions: status === "approved" && ad.impressions === 0 ? 1200 : ad.impressions,
    };
    return updated;
  });

  await writePartnerAdsStore({ ads });
  return updated;
}
