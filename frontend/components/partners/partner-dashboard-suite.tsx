"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  BarChart3,
  CalendarCheck2,
  CalendarPlus,
  Download,
  FileText,
  Loader2,
  LogOut,
  Megaphone,
  ReceiptText,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { secureFetch } from "@/lib/client-security";
import { PartnerAdsManager } from "@/components/partners/partner-ads-manager";

type PartnerDashboardSection = "home" | "bookings" | "services" | "ads" | "invoices" | "account";

type PartnerDashboardSuiteProps = {
  section?: PartnerDashboardSection;
};

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  message?: string;
};

type PartnerSummary = {
  companyName?: string;
  balance?: string | number;
  bookings?: {
    total?: number;
    active?: number;
    completed?: number;
  };
  services?: {
    total?: number;
    published?: number;
  };
  invoicesTotal?: string | number;
};

type PartnerProfile = {
  id?: string;
  company_name?: string;
  manager_name?: string;
  city?: string;
  activity_type?: string;
  enabled_features?: Record<string, unknown> | string[];
  commission_rules?: Record<string, unknown> | null;
  allowed_cities?: string[];
  service_types?: string[];
  permissions?: Record<string, boolean> | string[];
};

type PartnerBooking = {
  id: string;
  booking_number?: string;
  guest_name?: string;
  service_title?: string;
  service_type?: string;
  city?: string;
  status?: string;
  total_amount?: string | number;
};

type PartnerService = {
  id: string;
  title?: string;
  service_type?: string;
  city?: string;
  status?: string;
  base_price?: string | number;
};

type PartnerInvoice = {
  id: string;
  invoice_number?: string;
  amount?: string | number;
  status?: string;
  issued_at?: string;
};

type DashboardData = {
  summary: PartnerSummary;
  profile: PartnerProfile;
  bookings: PartnerBooking[];
  services: PartnerService[];
  invoices: PartnerInvoice[];
};

const statusLabels: Record<string, string> = {
  pending: "بانتظار التأكيد",
  confirmed: "مؤكد",
  checked_in: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغاة",
  paid: "مدفوعة",
  overdue: "متأخرة",
  published: "منشورة",
  review: "تحت المراجعة",
  active: "نشط",
  scheduled: "مجدول",
  draft: "مسودة",
};

const statusClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  checked_in: "bg-indigo-50 text-indigo-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
  published: "bg-emerald-50 text-emerald-700",
  review: "bg-amber-50 text-amber-700",
  active: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-blue-50 text-blue-700",
  draft: "bg-slate-100 text-slate-700",
};

const permissionLabels: Record<string, { label: string; description: string }> = {
  view_bookings: { label: "عرض الحجوزات", description: "متابعة الحجوزات وحالات التنفيذ." },
  manage_services: { label: "إدارة الخدمات", description: "إضافة وتحديث الخدمات المتاحة للعملاء." },
  view_invoices: { label: "عرض الفواتير", description: "متابعة الفواتير والمدفوعات." },
  manage_account: { label: "إدارة الحساب", description: "تحديث بيانات المنشأة والإعدادات." },
};

const navItems: Array<{
  key: PartnerDashboardSection;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  permission?: string;
  feature?: "ads";
}> = [
  { key: "home", label: "الرئيسية", href: "/partner-dashboard", icon: CalendarCheck2 },
  { key: "bookings", label: "الحجوزات", href: "/partner-dashboard/bookings", icon: CalendarPlus, permission: "view_bookings" },
  { key: "services", label: "الخدمات", href: "/partner-dashboard/services", icon: Sparkles, permission: "manage_services" },
  { key: "ads", label: "الإعلانات", href: "/partner-dashboard/ads", icon: Megaphone, feature: "ads" },
  { key: "invoices", label: "الفواتير", href: "/partner-dashboard/invoices", icon: FileText, permission: "view_invoices" },
  { key: "account", label: "الحساب", href: "/partner-dashboard/account", icon: Settings, permission: "manage_account" },
];

function StatusPill({ status = "draft" }: { status?: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass[status] ?? "bg-slate-100 text-slate-700"}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}

function formatCurrency(value: string | number | undefined) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return String(value ?? "0");
  return new Intl.NumberFormat("ar-SA").format(numeric) + " ر.س";
}

function asPermissionMap(value: PartnerProfile["permissions"]) {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((key) => [key, true])) as Record<string, boolean>;
  }
  return value ?? {};
}

function asFeatureMap(value: PartnerProfile["enabled_features"]) {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((key) => [key, true])) as Record<string, unknown>;
  }
  return value ?? {};
}

function hasPermission(permissions: Record<string, boolean>, permission?: string) {
  return !permission || Boolean(permissions[permission]);
}

async function fetchPartnerJson<T>(path: string, required = true): Promise<T> {
  const response = await secureFetch(`/api/partner-system/${path}`, { cache: "no-store" }).catch(() => null);
  if (response?.status === 401 && typeof window !== "undefined") {
    window.location.href = `/partner-dashboard/login?return_url=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }

  if (!response?.ok) {
    if (!required) return [] as T;
    throw new Error("Unable to load partner dashboard data.");
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!payload?.ok) {
    if (!required) return [] as T;
    throw new Error(payload?.message || "Unable to load partner dashboard data.");
  }

  return payload.data as T;
}

async function loadDashboardData(): Promise<DashboardData> {
  const [summary, profile, bookings, services, invoices] = await Promise.all([
    fetchPartnerJson<PartnerSummary>("partner/dashboard"),
    fetchPartnerJson<PartnerProfile>("partner/me"),
    fetchPartnerJson<PartnerBooking[]>("bookings", false),
    fetchPartnerJson<PartnerService[]>("services", false),
    fetchPartnerJson<PartnerInvoice[]>("invoices", false),
  ]);

  return {
    summary,
    profile,
    bookings: Array.isArray(bookings) ? bookings : [],
    services: Array.isArray(services) ? services : [],
    invoices: Array.isArray(invoices) ? invoices : [],
  };
}

export function PartnerDashboardSuite({ section = "home" }: PartnerDashboardSuiteProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadDashboardData()
      .then((nextData) => {
        if (!active) return;
        setData(nextData);
        setError("");
      })
      .catch((loadError: Error) => {
        if (!active) return;
        setError(loadError.message || "تعذر تحميل بيانات الشريك.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await secureFetch("/api/partner-auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/partner-dashboard/login";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] text-slate-600" dir="rtl">
        <div className="flex items-center gap-3 text-sm font-black">
          <Loader2 className="size-5 animate-spin text-[#FF385C]" />
          جاري تحميل بيانات الشريك...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] p-4" dir="rtl">
        <div className="max-w-md rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-black text-slate-950">تعذر تحميل لوحة الشريك</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">{error || "يرجى تسجيل الدخول مرة أخرى."}</p>
          <Link href="/partner-dashboard/login" className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const permissions = asPermissionMap(data.profile.permissions);
  const features = asFeatureMap(data.profile.enabled_features);
  const serviceTypes = data.profile.service_types?.length ? data.profile.service_types : Array.from(new Set(data.services.map((service) => service.service_type).filter(Boolean))) as string[];
  const companyName = data.profile.company_name || data.summary.companyName || "الشريك";
  const city = data.profile.city || data.profile.allowed_cities?.[0] || "";
  const canUseAds = Boolean(features.ads || features.advertising);
  const visibleNav = navItems.filter((item) => {
    if (item.feature === "ads") return canUseAds;
    return hasPermission(permissions, item.permission);
  });
  const currentSection = visibleNav.some((item) => item.key === section) ? section : "home";

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950" dir="rtl">
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white p-5 lg:min-h-screen lg:border-l lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-slate-950 text-lg font-black text-white">{companyName.slice(0, 1)}</div>
            <div>
              <div className="text-xs font-bold text-slate-500">بوابة الشريك</div>
              <div className="text-lg font-black">{companyName}</div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#FF385C]/20 bg-[#FF385C]/5 p-4">
            <div className="text-xs font-black text-[#FF385C]">إعدادات الباقة والصلاحيات</div>
            <div className="mt-2 text-lg font-black text-slate-950">حسب ربط لوحة الإدارة</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{serviceTypes.length} نوع خدمة متاح</div>
          </div>

          <nav className="mt-6 grid gap-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const active = currentSection === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition ${
                    active ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon className="size-4 text-[#FF385C]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-700">
              <ShieldCheck className="size-4" />
              الحساب مفعّل
            </div>
            <p className="mt-2 text-xs font-semibold leading-6 text-emerald-700/80">الأقسام الظاهرة ناتجة من الصلاحيات الفعلية في partner-api.</p>
          </div>

          <button onClick={logout} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-black text-slate-700">
            <LogOut className="size-4" />
            خروج
          </button>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Hero section={currentSection} companyName={companyName} />

          {currentSection === "home" ? (
            <>
              <StatsGrid summary={data.summary} />
              <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
                <BookingsTable bookings={data.bookings.slice(0, 4)} />
                <div className="grid gap-6">
                  <PermissionsPanel permissions={permissions} serviceTypes={serviceTypes} canUseAds={canUseAds} />
                  <PackageServicesPanel services={data.services} />
                </div>
              </section>
            </>
          ) : null}

          {currentSection === "bookings" ? <BookingsTable bookings={data.bookings} expanded /> : null}
          {currentSection === "services" ? <ServicesGrid services={data.services} /> : null}
          {currentSection === "ads" ? (
            <PartnerAdsManager partner={{ id: data.profile.id || "partner", slug: data.profile.id || "partner", company: companyName, city }} serviceTypes={serviceTypes} />
          ) : null}
          {currentSection === "invoices" ? <InvoicesPanel invoices={data.invoices} /> : null}
          {currentSection === "account" ? <AccountPanel profile={data.profile} companyName={companyName} serviceTypes={serviceTypes} /> : null}
        </main>
      </div>
    </div>
  );
}

function Hero({ section, companyName }: { section: PartnerDashboardSection; companyName: string }) {
  const titles: Record<PartnerDashboardSection, string> = {
    home: "مركز تشغيل الحجوزات والخدمات",
    bookings: "إدارة الحجوزات",
    services: "إدارة الخدمات",
    ads: "إدارة الإعلانات",
    invoices: "الفواتير والمدفوعات",
    account: "إعدادات الحساب",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/75">
            <CalendarCheck2 className="size-4 text-[#FF385C]" />
            {titles[section]}
          </div>
          <h1 className="mt-5 text-3xl font-black">مرحباً، {companyName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">بيانات هذه اللوحة تأتي مباشرة من partner-api حسب الجلسة والصلاحيات الحالية.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/partner-dashboard/services" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white">
            <CalendarPlus className="size-4" />
            إضافة خدمة
          </Link>
          <button onClick={() => window.location.reload()} className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-black text-white">
            <RotateCcw className="size-4" />
            تحديث
          </button>
        </div>
      </div>
    </section>
  );
}

function StatsGrid({ summary }: { summary: PartnerSummary }) {
  const stats = [
    { label: "الحجوزات النشطة", value: summary.bookings?.active ?? 0, hint: `من أصل ${summary.bookings?.total ?? 0}`, icon: CalendarCheck2 },
    { label: "الحجوزات المكتملة", value: summary.bookings?.completed ?? 0, hint: "حسب partner-api", icon: BarChart3 },
    { label: "الخدمات المنشورة", value: summary.services?.published ?? 0, hint: `من أصل ${summary.services?.total ?? 0}`, icon: Sparkles },
    { label: "إجمالي الفواتير", value: formatCurrency(summary.invoicesTotal), hint: "آخر بيانات الفوترة", icon: ReceiptText },
    { label: "الرصيد", value: formatCurrency(summary.balance), hint: "الرصيد الحالي", icon: FileText },
  ];

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-black text-slate-500">{item.label}</span>
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#FF385C]/10 text-[#FF385C]">
                <Icon className="size-5" />
              </span>
            </div>
            <div className="mt-4 text-2xl font-black text-slate-950">{item.value}</div>
            <div className="mt-2 text-xs font-semibold text-slate-400">{item.hint}</div>
          </article>
        );
      })}
    </section>
  );
}

function BookingsTable({ bookings, expanded = false }: { bookings: PartnerBooking[]; expanded?: boolean }) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white first:mt-0">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">إدارة الحجوزات</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">متابعة الحجوزات، الضيوف، الخدمات، والحالات.</p>
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-black">
          <ReceiptText className="size-4" />
          تقرير الحجوزات
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-5 py-3">رقم الحجز</th>
              <th className="px-5 py-3">الضيف</th>
              <th className="px-5 py-3">الخدمة</th>
              <th className="px-5 py-3">المدينة</th>
              <th className="px-5 py-3">الحالة</th>
              <th className="px-5 py-3">القيمة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.length ? bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-5 py-4 font-black text-slate-950">
                  {booking.booking_number || booking.id}
                  <div className="mt-1 text-xs text-slate-400">{booking.service_type || "خدمة"}</div>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-700">{booking.guest_name || "-"}</td>
                <td className="px-5 py-4 text-slate-500">{booking.service_title || "-"}</td>
                <td className="px-5 py-4 text-slate-500">{booking.city || "-"}</td>
                <td className="px-5 py-4"><StatusPill status={booking.status} /></td>
                <td className="px-5 py-4 font-black text-slate-800">{formatCurrency(booking.total_amount)}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-5 py-8 text-center font-bold text-slate-400">لا توجد حجوزات متاحة حالياً.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {expanded ? null : (
        <div className="border-t border-slate-100 p-4">
          <Link href="/partner-dashboard/bookings" className="text-sm font-black text-[#FF385C]">عرض كل الحجوزات</Link>
        </div>
      )}
    </section>
  );
}

function PermissionsPanel({ permissions, serviceTypes, canUseAds }: { permissions: Record<string, boolean>; serviceTypes: string[]; canUseAds: boolean }) {
  const permissionKeys = Object.keys(permissionLabels);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-black">الصلاحيات المفعلة</h2>
      <div className="mt-5 grid gap-3">
        {permissionKeys.map((key) => {
          const meta = permissionLabels[key];
          const enabled = Boolean(permissions[key]);
          return (
            <div key={key} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#FF385C]"><ShieldCheck className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-slate-800">{meta.label}</div>
                <div className="truncate text-xs font-semibold text-slate-400">{meta.description}</div>
              </div>
              <StatusPill status={enabled ? "active" : "cancelled"} />
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {serviceTypes.map((type) => <span key={type} className="rounded-full bg-[#FF385C]/10 px-3 py-1 text-xs font-black text-[#FF385C]">{type}</span>)}
        {canUseAds ? <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">الإعلانات مفعلة</span> : null}
      </div>
    </section>
  );
}

function PackageServicesPanel({ services }: { services: PartnerService[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-black">الخدمات الحالية</h2>
      <div className="mt-5 grid gap-3">
        {services.slice(0, 3).map((service) => (
          <div key={service.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="font-black text-slate-800">{service.title || "خدمة"}</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{service.service_type || "-"} · {service.city || "-"}</div>
          </div>
        ))}
        {!services.length ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-400">لا توجد خدمات مسجلة حالياً.</div> : null}
      </div>
    </section>
  );
}

function ServicesGrid({ services }: { services: PartnerService[] }) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">الخدمات المتاحة</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">قائمة الخدمات تأتي من partner-api حسب صلاحية إدارة الخدمات.</p>
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white">
          <CalendarPlus className="size-4" />
          خدمة جديدة
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-950">{service.title || "خدمة"}</h3>
                <div className="mt-1 text-sm font-semibold text-slate-500">{service.service_type || "-"} · {service.city || "-"}</div>
              </div>
              <StatusPill status={service.status} />
            </div>
            <div className="mt-5 rounded-lg bg-white p-3 text-sm">
              <div className="text-xs font-bold text-slate-400">السعر الأساسي</div>
              <div className="mt-1 font-black">{formatCurrency(service.base_price)}</div>
            </div>
          </article>
        ))}
        {!services.length ? <div className="rounded-lg bg-slate-50 p-5 text-sm font-bold text-slate-400">لا توجد خدمات متاحة للعرض.</div> : null}
      </div>
    </section>
  );
}

function InvoicesPanel({ invoices }: { invoices: PartnerInvoice[] }) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-black">الفواتير</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="font-black text-slate-950">{invoice.invoice_number || invoice.id}</div>
              <div className="mt-1 text-sm font-semibold text-slate-500">{invoice.issued_at || "-"}</div>
            </div>
            <div className="text-left">
              <div className="font-black text-slate-950">{formatCurrency(invoice.amount)}</div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <StatusPill status={invoice.status} />
                <Link href={`/api/partner-system/invoices/${invoice.id}/pdf`} className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200">
                  <Download className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!invoices.length ? <div className="p-8 text-center text-sm font-bold text-slate-400">لا توجد فواتير متاحة حالياً.</div> : null}
      </div>
    </section>
  );
}

function AccountPanel({ profile, companyName, serviceTypes }: { profile: PartnerProfile; companyName: string; serviceTypes: string[] }) {
  const rows = [
    ["اسم المنشأة", companyName],
    ["المسؤول", profile.manager_name || "-"],
    ["المدينة", profile.city || "-"],
    ["النشاط", profile.activity_type || "-"],
    ["أنواع الخدمات", serviceTypes.join("، ") || "-"],
  ];

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">بيانات الحساب</h2>
        <div className="mt-5 grid gap-4">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">{label}</div>
              <div className="mt-1 font-black text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <BarChart3 className="size-5 text-[#FF385C]" />
          ملخص الربط
        </h2>
        <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">أي تغيير في صلاحيات الشريك من لوحة الإدارة ينعكس على هذه اللوحة من خلال endpoints الفعلية.</p>
      </div>
    </section>
  );
}
