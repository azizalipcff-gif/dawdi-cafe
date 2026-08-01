// Server-side locale helpers
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";

// Resolve the active locale for the current request. The proxy keeps this
// cookie in sync with the URL locale; without a cookie we fall back to the
// default locale.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}
