"use client";

import { secureFetch } from "@/lib/client-security";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  returnUrl?: string;
};

export function LoginForm({ returnUrl = "/" }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      mobile: String(formData.get("mobile") || ""),
      digit1: String(formData.get("digit1") || ""),
      digit2: String(formData.get("digit2") || ""),
      digit3: String(formData.get("digit3") || ""),
      digit4: String(formData.get("digit4") || ""),
      remember: formData.get("remember") === "on",
      return_url: returnUrl,
    };

    try {
      const response = await secureFetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const result = contentType.includes("application/json")
        ? ((await response.json()) as {
            status?: number;
            message?: string;
            redirect?: string;
          })
        : { status: 0, message: "استجابة غير متوقعة من خدمة الدخول." };

      if (!response.ok || result.status !== 1) {
        setError(result.message || "تعذر تسجيل الدخول حاليًا.");
        return;
      }

      setMessage(result.message || "تم تسجيل الدخول بنجاح.");
      startTransition(() => {
        router.push(result.redirect || returnUrl);
        router.refresh();
      });
    } catch {
      setError("تعذر الوصول إلى خدمة تسجيل الدخول حاليًا. تأكد من تشغيل السيرفر وقاعدة البيانات.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.25)]"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            رقم الجوال
          </label>
          <input
            type="tel"
            name="mobile"
            placeholder="05xxxxxxxx"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            رمز التحقق
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((index) => (
              <input
                key={index}
                type="text"
                name={`digit${index}`}
                inputMode="numeric"
                maxLength={1}
                className="h-14 rounded-lg border border-slate-200 bg-slate-50 text-center text-lg font-semibold outline-none transition focus:border-rose-300 focus:bg-white"
                required
              />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" name="remember" className="size-4 rounded border-slate-300" />
          تذكرني على هذا الجهاز
        </label>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-rose-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </div>
    </form>
  );
}
