import { headers } from "next/headers";
import { WishlistSuite } from "@/components/dashboard/wishlist-suite";
import { getSessionUser, getWishlist } from "@/lib/api";

export default async function DashboardWishlistPage() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") ?? "";
  const [currentUser, wishlist] = await Promise.all([
    getSessionUser(cookieHeader),
    getWishlist(cookieHeader),
  ]);

  if (!currentUser) {
    return null;
  }

  return <WishlistSuite currentUser={currentUser} wishlist={wishlist ?? []} />;
}
