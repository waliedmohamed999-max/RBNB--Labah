"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { secureFetch } from "@/lib/client-security";

export function PartnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = useMemo(() => searchParams.get("return_url") || "/partner-dashboard", [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const response = await secureFetch("/api/partner-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);

    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.ok) {
      setError(payload?.message || "تعذر تسجيل الدخول. تحقق من البيانات وحالة اعتماد الحساب.");
      setSubmitting(false);
      return;
    }

    router.replace(returnUrl.startsWith("/") ? returnUrl : "/partner-dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#FF385C]/10 text-[#FF385C]">
          <LockKeyhole className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-950">دخول بوابة الشريك</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">استخدم حساب الشريك المعتمد من لوحة الإدارة.</p>
        </div>
      </div>

      <label className="mt-6 block text-sm font-black text-slate-700" htmlFor="partner-email">البريد الإلكتروني</label>
      <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-[#FF385C]">
        <Mail className="size-4 text-slate-400" />
        <input
          id="partner-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-left text-sm font-semibold outline-none"
          autoComplete="email"
          required
        />
      </div>

      <label className="mt-4 block text-sm font-black text-slate-700" htmlFor="partner-password">كلمة المرور</label>
      <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-[#FF385C]">
        <LockKeyhole className="size-4 text-slate-400" />
        <input
          id="partner-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-left text-sm font-semibold outline-none"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FF385C] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="size-4" />
        {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
