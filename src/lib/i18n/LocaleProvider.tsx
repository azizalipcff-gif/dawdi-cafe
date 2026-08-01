"use client";

import { createContext, useContext, useMemo } from "react";
import { getDir, localizePath, type Locale } from "./config";
import type { Dictionary } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  // Localize an internal path for the active locale, e.g. link("/menu") -> "/fr/menu".
  link: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: getDir(locale),
      dict,
      link: (path) => localizePath(path, locale),
    }),
    [locale, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <LocaleProvider>");
  }
  return ctx;
}
