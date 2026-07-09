"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Check,
  CirclePause,
  Eye,
  EyeOff,
  Layers3,
  MapPin,
  Megaphone,
  PackageCheck,
  Plus,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  X,
} from "lucide-react";
import {
  availableCities,
  availableServiceTypes,
  demoPartners,
  partnerPackages,
  partnerPermissions,
  partnerRequests,
  provisioningSteps,
} from "@/lib/partner-system-demo";
import { AdminPartnerAdsReview } from "@/components/partners/admin-partner-ads-review";

type PartnerStatus = "approved" | "pending" | "suspended" | "rejected" | "info_requested";
type TabKey = "requests" | "partners" | "packages" | "permissions" | "ads";

const statusLabels: Record<PartnerStatus, string> = {
  approved: "مفعّل",
  pending: "قيد المراجعة",
  suspended: "موقوف",
  rejected: "مرفوض",
  info_requested: "بانتظار معلومات",
};

const statusStyles: Record<PartnerStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-700",
  rejected: "bg-slate-100 text-slate-600",
  info_requested: "bg-blue-50 text-blue-700",
};

const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "requests", label: "طلبات الشركاء", icon: BadgeCheck },
  { key: "partners", label: "الشركاء المعتمدين", icon: Building2 },
  { key: "packages", label: "الباقات والأسعار", icon: Layers3 },
  { key: "permissions", label: "مصفوفة الصلاحيات", icon: ShieldCheck },
  { key: "ads", label: "مراجعة الإعلانات", icon: Megaphone },
];

function StatusBadge({ status }: { status: PartnerStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

function serviceTypeToPermissionLabel(serviceType: string) {
  const map: Record<string, string> = {
    "شاليهات وفلل": "قسم الشاليهات والفلل",
    فنادق: "قسم الفنادق",
    "فعاليات ومؤتمرات": "قسم الفعاليات والمؤتمرات",
    حفلات: "قسم الحفلات",
    "تجارب مثيرة": "قسم التجارب المثيرة",
  };
  return map[serviceType] ?? serviceType;
}

export function AdminPartnersConsole({ initialTab = "requests" }: { initialTab?: TabKey }) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [partners, setPartners] = useState(demoPartners);
  const [requests, setRequests] = useState(partnerRequests);
  const [selectedId, setSelectedId] = useState(demoPartners[0]?.id ?? "");
  const [selectedPackageId, setSelectedPackageId] = useState(partnerPackages[1]?.id ?? "growth");
  const selected = partners.find((partner) => partner.id === selectedId) ?? partners[0];
  const selectedPackage = partnerPackages.find((plan) => plan.id === selectedPackageId) ?? partnerPackages[0];

  const stats = useMemo(
    () => [
      { label: "طلبات نشطة", value: requests.filter((request) => request.status === "pending").length },
      { label: "شركاء مفعّلين", value: partners.filter((partner) => partner.status === "approved").length },
      { label: "باقات متاحة", value: partnerPackages.length },
      { label: "أقسام قابلة للتحكم", value: availableServiceTypes.length },
    ],
    [partners, requests],
  );

  function approveRequest(id: string, packageId: string) {
    const request = requests.find((item) => item.id === id);
    const plan = partnerPackages.find((item) => item.id === packageId);
    if (!request || !plan) return;

    const nextPartner = {
      id: `ptr-${Date.now()}`,
      slug: `partner-${Date.now()}`,
      company: request.company,
      manager: request.manager,
      city: request.city,
      activity: request.activity,
      status: "approved",
      monthlyBookings: request.expectedBookings,
      serviceTypes: plan.serviceTypes,
      cities: [request.city],
      logo: request.company.slice(0, 1),
      permissions: plan.permissions,
      packageId: plan.id,
      approvalChecklist: ["identity_verified", "documents_verified", "package_assigned", "permissions_provisioned"],
    };

    setPartners((items) => [nextPartner, ...items]);
    setRequests((items) => items.map((item) => (item.id === id ? { ...item, status: "approved" } : item)));
    setSelectedId(nextPartner.id);
    setActiveTab("partners");
  }

  function setStatus(id: string, status: PartnerStatus) {
    setPartners((items) => items.map((partner) => (partner.id === id ? { ...partner, status } : partner)));
  }

  function applyPackageToSelected(packageId: string) {
    const plan = partnerPackages.find((item) => item.id === packageId);
    if (!plan || !selected) return;
    setSelectedPackageId(packageId);
    setPartners((items) =>
      items.map((partner) =>
        partner.id === selected.id
          ? {
              ...partner,
              packageId: plan.id,
              permissions: plan.permissions,
              serviceTypes: plan.serviceTypes,
              approvalChecklist: Array.from(new Set([...partner.approvalChecklist, "package_assigned", "permissions_provisioned"])),
            }
          : partner,
      ),
    );
  }

  function togglePermission(key: string) {
    setPartners((items) =>
      items.map((partner) => {
        if (partner.id !== selected.id) return partner;
        const hasPermission = partner.permissions.includes(key);
        return {
          ...partner,
          permissions: hasPermission ? partner.permissions.filter((permission) => permission !== key) : [...partner.permissions, key],
        };
      }),
    );
  }

  if (!selected) return null;

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/75">
              <ShieldCheck className="size-4 text-[#FF385C]" />
              مركز الشركاء والباقات
            </div>
            <h1 className="mt-5 text-3xl font-black">منظومة واحدة للشركاء والصلاحيات</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
              الطلب يبدأ كمراجعة، ثم عند الموافقة يتم ربط الشريك بباقة تفتح له أقسام الخدمات المسموحة وتطبق الصلاحيات والعمولات تلقائياً.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg bg-white/10 p-4">
                <div className="text-xs font-bold text-white/55">{item.label}</div>
                <div className="mt-2 text-2xl font-black">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-black transition ${
                active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon className={`size-4 ${active ? "text-[#FF385C]" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "requests" ? (
        <section className="grid gap-4">
          {requests.map((request) => {
            const plan = partnerPackages.find((item) => item.id === request.requestedPackageId) ?? partnerPackages[0];
            return (
              <article key={request.id} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-lg bg-slate-950 font-black text-white">
                        {request.company.slice(0, 1)}
                      </span>
                      <div>
                        <h2 className="text-xl font-black text-slate-950">{request.company}</h2>
                        <div className="mt-1 text-sm font-semibold text-slate-500">{request.manager} · {request.activity}</div>
                      </div>
                      <StatusBadge status={request.status as PartnerStatus} />
                    </div>
                    <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-4">
                      <span>المدينة: {request.city}</span>
                      <span>الباقة المطلوبة: {plan.name}</span>
                      <span>حجوزات متوقعة: {request.expectedBookings}</span>
                      <span>المخاطر: {request.risk === "low" ? "منخفضة" : "متوسطة"}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {plan.serviceTypes.map((serviceType) => (
                        <span key={serviceType} className="rounded-full bg-[#FF385C]/10 px-3 py-1 text-xs font-black text-[#FF385C]">
                          {serviceTypeToPermissionLabel(serviceType)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full rounded-lg border border-slate-100 bg-slate-50 p-4 xl:w-[360px]">
                    <label className="grid gap-2 text-sm font-black text-slate-700">
                      باقة التفعيل
                      <select
                        defaultValue={plan.id}
                        onChange={(event) => setSelectedPackageId(event.target.value)}
                        className="h-11 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-[#FF385C]"
                      >
                        {partnerPackages.map((item) => (
                          <option key={item.id} value={item.id}>{item.name} - {item.price}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        disabled={request.status === "approved"}
                        onClick={() => approveRequest(request.id, selectedPackageId || plan.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-black text-white disabled:opacity-50"
                      >
                        <Check className="size-4" />
                        موافقة وتفعيل
                      </button>
                      <button
                        onClick={() => setRequests((items) => items.map((item) => (item.id === request.id ? { ...item, status: "rejected" } : item)))}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-black text-red-700"
                      >
                        <X className="size-4" />
                        رفض
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {activeTab === "partners" ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black">الشركاء المعتمدين</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">كل شريك مرتبط بباقة وصلاحيات وأقسام خدمات محددة.</p>
              </div>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white">
                <Plus className="size-4" />
                شريك يدوي
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-right text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500">
                  <tr>
                    <th className="px-5 py-3">الشريك</th>
                    <th className="px-5 py-3">الباقة</th>
                    <th className="px-5 py-3">المدينة</th>
                    <th className="px-5 py-3">النشاط</th>
                    <th className="px-5 py-3">الحالة</th>
                    <th className="px-5 py-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.map((partner) => {
                    const plan = partnerPackages.find((item) => item.id === partner.packageId);
                    return (
                      <tr key={partner.id} className={selected.id === partner.id ? "bg-rose-50/40" : ""}>
                        <td className="px-5 py-4">
                          <button onClick={() => setSelectedId(partner.id)} className="flex items-center gap-3 text-right">
                            <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 font-black text-white">{partner.logo}</span>
                            <span>
                              <span className="block font-black text-slate-950">{partner.company}</span>
                              <span className="mt-1 block text-xs font-semibold text-slate-500">{partner.manager}</span>
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-4 font-black text-slate-700">{plan?.name ?? "-"}</td>
                        <td className="px-5 py-4 font-semibold text-slate-600">{partner.city}</td>
                        <td className="px-5 py-4 text-slate-500">{partner.activity}</td>
                        <td className="px-5 py-4"><StatusBadge status={partner.status as PartnerStatus} /></td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setStatus(partner.id, "approved")} className="inline-flex size-9 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700">
                              <Check className="size-4" />
                            </button>
                            <button onClick={() => setStatus(partner.id, "suspended")} className="inline-flex size-9 items-center justify-center rounded-lg border border-amber-200 text-amber-700">
                              <CirclePause className="size-4" />
                            </button>
                            <button onClick={() => setStatus(partner.id, "rejected")} className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 text-red-700">
                              <X className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="grid gap-6">
            <PartnerControlCard
              selected={selected}
              selectedPackage={partnerPackages.find((item) => item.id === selected.packageId) ?? selectedPackage}
              onApplyPackage={applyPackageToSelected}
              onTogglePermission={togglePermission}
            />
          </aside>
        </section>
      ) : null}

      {activeTab === "packages" ? (
        <section className="grid gap-5 xl:grid-cols-3">
          {partnerPackages.map((plan) => (
            <article key={plan.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">{plan.name}</h2>
                  <div className="mt-2 text-sm font-bold text-slate-500">{plan.price}</div>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">عمولة {plan.commission}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-400">الخدمات</div>
                  <div className="mt-1 font-black">{plan.serviceLimit}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-400">الحجوزات</div>
                  <div className="mt-1 font-black">{plan.bookingLimit}</div>
                </div>
              </div>
              <div className="mt-5">
                <div className="text-xs font-black text-slate-400">الأقسام المفتوحة</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {plan.serviceTypes.map((serviceType) => (
                    <span key={serviceType} className="rounded-full bg-[#FF385C]/10 px-3 py-1 text-xs font-black text-[#FF385C]">{serviceType}</span>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                {partnerPermissions.map((permission) => (
                  <div key={permission.key} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm">
                    <span className="font-black text-slate-700">{permission.label}</span>
                    {plan.permissions.includes(permission.key) ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-slate-300" />}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "permissions" ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-black">مصفوفة الصلاحيات حسب الباقة</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-right text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500">
                  <tr>
                    <th className="px-4 py-3">الصلاحية</th>
                    {partnerPackages.map((plan) => <th key={plan.id} className="px-4 py-3">{plan.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partnerPermissions.map((permission) => (
                    <tr key={permission.key}>
                      <td className="px-4 py-4 font-black text-slate-800">{permission.label}</td>
                      {partnerPackages.map((plan) => (
                        <td key={plan.id} className="px-4 py-4">
                          {plan.permissions.includes(permission.key) ? <Check className="size-5 text-emerald-600" /> : <X className="size-5 text-slate-300" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-black">تسلسل الموافقة</h2>
            <div className="mt-5 grid gap-3">
              {provisioningSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                  <span className="text-sm font-black text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "ads" ? <AdminPartnerAdsReview /> : null}
    </div>
  );
}

function PartnerControlCard({
  selected,
  selectedPackage,
  onApplyPackage,
  onTogglePermission,
}: {
  selected: (typeof demoPartners)[number];
  selectedPackage: (typeof partnerPackages)[number];
  onApplyPackage: (packageId: string) => void;
  onTogglePermission: (key: string) => void;
}) {
  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-slate-950 font-black text-white">{selected.logo}</span>
          <div>
            <h2 className="text-xl font-black">{selected.company}</h2>
            <div className="mt-1 text-sm font-semibold text-slate-500">{selected.manager}</div>
          </div>
        </div>
        <label className="mt-5 grid gap-2 text-sm font-black text-slate-700">
          الباقة المرتبطة
          <select
            value={selectedPackage.id}
            onChange={(event) => onApplyPackage(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-[#FF385C]"
          >
            {partnerPackages.map((plan) => (
              <option key={plan.id} value={plan.id}>{plan.name} - {plan.price}</option>
            ))}
          </select>
        </label>
        <div className="mt-5 grid gap-3">
          {partnerPermissions.map((permission) => {
            const Icon = permission.icon;
            const enabled = selected.permissions.includes(permission.key);
            return (
              <button
                key={permission.key}
                onClick={() => onTogglePermission(permission.key)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-right"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#FF385C]">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-slate-800">{permission.label}</span>
                    <span className="block truncate text-xs font-semibold text-slate-400">{permission.description}</span>
                  </span>
                </span>
                <span className={`flex size-8 items-center justify-center rounded-full ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                  {enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <MapPin className="size-5 text-[#FF385C]" />
          نطاق التشغيل
        </h2>
        <div className="mt-4">
          <div className="text-xs font-black text-slate-400">المدن المتاحة</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableCities.map((city) => (
              <span key={city} className={`rounded-full px-3 py-1 text-xs font-black ${selected.cities.includes(city) ? "bg-[#FF385C]/10 text-[#FF385C]" : "bg-slate-100 text-slate-500"}`}>
                {city}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-xs font-black text-slate-400">الخدمات المفتوحة</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableServiceTypes.map((serviceType) => (
              <span key={serviceType} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${selected.serviceTypes.includes(serviceType) ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}>
                <Sparkles className="size-3" />
                {serviceType}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
        <h2 className="flex items-center gap-2 text-lg font-black text-emerald-800">
          <PackageCheck className="size-5" />
          حالة التفعيل
        </h2>
        <div className="mt-4 grid gap-2">
          {provisioningSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-2 text-sm font-black text-emerald-700">
              <TicketCheck className="size-4" />
              {index + 1}. {step}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
