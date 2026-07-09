import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthAccessPanel } from "@/components/auth/auth-access-panel";
import { SiteNavbar } from "@/components/sections/site-navbar";
import { getPublicSystemSettings, getSessionUser } from "@/lib/api";
import { resolveBrand } from "@/lib/brand";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function safeMode(value?: string | string[]) {
  const mode = Array.isArray(value) ? value[0] : value;
  return mode === "register" || mode === "partner" ? mode : "login";
}

function safeReturnUrl(value?: string | string[]) {
  const url = Array.isArray(value) ? value[0] : value;
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") ? url : "/";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") ?? "";
  const resolvedSearchParams = (await searchParams) ?? {};
  const returnUrl = safeReturnUrl(resolvedSearchParams.return_url);
  const [currentUser, publicSettings] = await Promise.all([
    getSessionUser(cookieHeader),
    getPublicSystemSettings(),
  ]);
  const siteBrand = resolveBrand(publicSettings);

  if (currentUser) {
    redirect(returnUrl === "/" ? currentUser.dashboard_url || "/dashboard" : returnUrl);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff5f6_0%,#f8f8f6_48%,#eef2ff_100%)] text-slate-950">
      <SiteNavbar currentUser={currentUser} />
      <AuthAccessPanel
        returnUrl={returnUrl}
        initialMode={safeMode(resolvedSearchParams.mode)}
        brandName={siteBrand.nameAr}
      />
    </main>
  );
}
