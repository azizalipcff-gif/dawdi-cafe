"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "./config";

// Persist the chosen language so the proxy, layouts and server actions agree
// on the active locale.
export async function setLocaleCookie(locale: string) {
  if (!isLocale(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

// The set of locales the switcher offers, exposed to client components.
export const availableLocales: Locale[] = ["en", "fr", "ar"];
