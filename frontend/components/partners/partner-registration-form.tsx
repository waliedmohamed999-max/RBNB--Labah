"use client";

import { useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, FileUp, LockKeyhole, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { secureFetch } from "@/lib/client-security";
import { registrationSteps } from "@/lib/partner-system-demo";

const activityTypes = [
  { label: "منشأة ضيافة", value: "hospitality" },
  { label: "منظم فعاليات", value: "events" },
  { label: "مزود تجارب", value: "experiences" },
  { label: "مزود متعدد الخدمات", value: "multi_service" },
];
const monthlyVolumes = [
  { label: "أقل من 100", value: "75" },
  { label: "100 - 500", value: "300" },
  { label: "500 - 1000", value: "750" },
  { label: "أكثر من 1000", value: "1200" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/10";

export function PartnerRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await secureFetch("/api/partner-system/auth/register-partner", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || "تعذر إرسال طلب الشراكة.");
      }

      event.currentTarget.reset();
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر إرسال طلب الشراكة.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" dir="rtl">
      <form
        onSubmit={submitRegistration}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_20px_70px_-52px_rgba(15,23,42,0.45)] sm:p-7"
      >
        <div className="mb-7 flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#FF385C]">تسجيل مزود خدمات</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">طلب انضمام شريك جديد</h1>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
            <LockKeyhole className="size-4" />
            الحالة بعد التسجيل: Pending
          </span>
        </div>

        {submitted ? (
          <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              تم استلام الطلب، ولن يتم تفعيل الحساب إلا بعد موافقة الأدمن.
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="اسم الشركة">
            <div className="relative">
              <Building2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input required name="companyName" className={`${inputClass} w-full pr-10`} placeholder="مثال: روافد التجارة" />
            </div>
          </Field>
          <Field label="اسم المسؤول">
            <div className="relative">
              <UserRound className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input required name="managerName" className={`${inputClass} w-full pr-10`} placeholder="الاسم الكامل" />
            </div>
          </Field>
          <Field label="رقم الجوال">
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input required name="mobile" inputMode="tel" className={`${inputClass} w-full pr-10 text-left`} dir="ltr" placeholder="+9665XXXXXXXX" />
            </div>
          </Field>
          <Field label="البريد الإلكتروني">
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input required name="email" type="email" className={`${inputClass} w-full pr-10 text-left`} dir="ltr" placeholder="partner@example.com" />
            </div>
          </Field>
          <Field label="كلمة المرور">
            <input required name="password" type="password" minLength={8} className={inputClass} placeholder="8 أحرف على الأقل" />
          </Field>
          <Field label="المدينة">
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input required name="city" className={`${inputClass} w-full pr-10`} placeholder="الرياض" />
            </div>
          </Field>
          <Field label="نوع النشاط">
            <select required name="activityType" className={inputClass} defaultValue="">
              <option value="" disabled>
                اختر النوع
              </option>
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="عدد الحجوزات المتوقع شهريًا">
            <select required name="expectedMonthlyBookings" className={inputClass} defaultValue="">
              <option value="" disabled>
                اختر النطاق
              </option>
              {monthlyVolumes.map((volume) => (
                <option key={volume.value} value={volume.value}>
                  {volume.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="رفع السجل التجاري">
            <span className="flex h-12 items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
              <FileUp className="size-4 text-[#FF385C]" />
              <input name="commercialRecord" type="file" accept=".pdf,image/png,image/jpeg,image/webp" className="w-full text-xs" />
            </span>
          </Field>
          <Field label="رفع الهوية">
            <span className="flex h-12 items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
              <FileUp className="size-4 text-[#FF385C]" />
              <input name="identityDocument" type="file" accept=".pdf,image/png,image/jpeg,image/webp" className="w-full text-xs" />
            </span>
          </Field>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold leading-6 text-slate-500">
            يتم حفظ المستندات في التخزين المحلي أو S3 حسب إعدادات البيئة، مع ربط الطلب بحساب Partner معزول.
          </p>
          <button disabled={isSubmitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#FF385C] px-6 text-sm font-black text-white shadow-[0_18px_45px_-25px_rgba(255,56,92,0.8)] transition hover:bg-[#e8284e] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
            <ArrowLeft className="size-4" />
          </button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-black text-slate-950">مسار القبول</h2>
          <div className="mt-5 grid gap-3">
            {registrationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#FF385C]">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-400">خطوة {index + 1}</div>
                    <div className="text-sm font-black text-slate-800">{step.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="text-sm font-bold text-white/60">RBAC</div>
          <div className="mt-2 text-2xl font-black">Partner</div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            لا تظهر صفحات الحجوزات والخدمات والفواتير إلا حسب الصلاحيات التي يحددها الأدمن لكل شريك.
          </p>
        </div>
      </aside>
    </div>
  );
}
