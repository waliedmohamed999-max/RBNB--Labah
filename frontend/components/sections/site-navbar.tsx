import type { BridgeMenuItem, BridgeSessionUser, BridgeSystemSettings } from "@/lib/api";
import { getPublicMenus, getPublicSystemSettings } from "@/lib/api";
import { Navbar } from "@/components/sections/navbar";

export async function SiteNavbar({
  currentUser,
  settings,
  menuItems,
}: {
  currentUser?: BridgeSessionUser | null;
  settings?: BridgeSystemSettings | null;
  menuItems?: BridgeMenuItem[];
}) {
  const [resolvedSettings, resolvedMenus] =
    settings !== undefined && menuItems !== undefined
      ? [settings, [{ items: menuItems }]]
      : await Promise.all([
          getPublicSystemSettings(),
          getPublicMenus("primary"),
        ]);

  return (
    <Navbar
      currentUser={currentUser}
      settings={resolvedSettings}
      menuItems={resolvedMenus?.[0]?.items ?? []}
    />
  );
}
