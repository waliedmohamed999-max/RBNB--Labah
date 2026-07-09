"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { secureFetch } from "@/lib/client-security";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await secureFetch("/api/session/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
    >
      <LogOut className="size-4" />
      تسجيل الخروج
    </button>
  );
}
