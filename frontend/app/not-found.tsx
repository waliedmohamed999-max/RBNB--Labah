import Link from "next/link";

export default function NotFound() {
  return (
    <main dir="rtl" className="grid min-h-screen place-items-center bg-[#f8f8f6] px-4 text-slate-950">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold text-rose-500">404</p>
        <h1 className="mt-3 text-3xl font-bold">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          الرابط الذي تحاول فتحه غير متاح أو تم نقله.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white"
        >
          العودة للرئيسية
        </Link>
      </section>
    </main>
  );
}
