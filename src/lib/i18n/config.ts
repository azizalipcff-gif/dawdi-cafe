// i18n configuration
export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Cookie that stores the visitor's chosen language.
export const LOCALE_COOKIE = "dawdi_locale";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

// Arabic reads right-to-left; the `<html dir>` attribute flips the layout.
export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

// Prefix a path with the current locale, e.g. "/menu" -> "/fr/menu".
// Passing an already-localized path replaces the prefix.
export function localizePath(path: string, locale: Locale): string {
  if (!path || path === "/") return `/${locale}`;
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments.shift();
  return `/${locale}${segments.length ? "/" + segments.join("/") : ""}`;
}

// Rewrite the locale prefix of a pathname for the language switcher,
// e.g. switchLocaleHref("/fr/menu", "fr", "ar") -> "/ar/menu".
export function switchLocaleHref(pathname: string, from: Locale, to: Locale): string {
  return localizePath(pathname, to);
}

// Simple `{name}` interpolation helper for dictionary strings.
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}
