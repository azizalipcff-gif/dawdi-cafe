import { revalidatePath } from "next/cache";
import { ADMIN_PATH } from "@/lib/constants";
import { locales, localizePath } from "@/lib/i18n/config";

// Revalidate the entire admin tree so the layout refetches fresh data after
// any mutation.
export function revalidateAdmin() {
  revalidatePath(ADMIN_PATH, "layout");
}

// Revalidate public-facing pages for all locales.
// If a productId is provided, also revalidate its detail page.
export function revalidatePublic(productId?: string) {
  // Revalidate homepage and menu for every locale.
  for (const locale of locales) {
    try {
      // Revalidate the route and the layout so any cached layout-level
      // data (used by server components) is refreshed as well. Some Next.js
      // setups cache layout fragments separately, so revalidating both
      // ensures the homepage reflects admin-driven changes.
      const home = localizePath("/", locale);
      const menu = localizePath("/menu", locale);
      revalidatePath(home);
      revalidatePath(home, "layout");
      revalidatePath(menu);
      revalidatePath(menu, "layout");
      if (productId) {
        const prod = localizePath(`/product/${productId}`, locale);
        revalidatePath(prod);
        revalidatePath(prod, "layout");
      }
    } catch (e) {
      // Swallow revalidation errors but log server-side for diagnostics.
      console.warn("revalidatePublic failed for", locale, productId, e);
    }
  }
}

// Reject obviously invalid ids before any privileged DB operation.
export function isValidId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 100;
}

// Keep only the explicitly allowed keys from a client-supplied patch so a
// caller cannot assign arbitrary columns (mass-assignment protection).
export function pickAllowed<T extends object>(
  obj: T,
  allowed: readonly string[]
): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key];
      if (value !== undefined) out[key] = value;
    }
  }
  return out as Partial<T>;
}

// Never surface raw Supabase/database error text to the browser. Log it
// server-side and return a generic, safe message instead.
export function dbError(error: unknown): { error: string } {
  if (error && typeof error === "object" && "message" in error) {
    console.error("[admin] db error:", (error as { message: string }).message);
  } else {
    console.error("[admin] db error:", error);
  }
  return { error: "A database error occurred. Please retry." };
}
