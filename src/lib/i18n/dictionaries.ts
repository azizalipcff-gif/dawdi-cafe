import en from "./en";
import fr from "./fr";
import ar from "./ar";
import type { Locale } from "./config";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, fr, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

// Build nav items from the dictionary so labels follow the active locale.
export function getNavItems(dict: Dictionary) {
  return [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.menu, href: "/menu" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.gallery, href: "/gallery" },
    { label: dict.nav.contact, href: "/contact" },
  ];
}
