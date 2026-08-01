export const SITE_NAME = "DAWDI CAFE";
export const SITE_TAGLINE = "Coffee for the Road";
export const SITE_DESCRIPTION =
  "Premium coffee, crêpes, snacks and quality drinks in Morocco.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// The admin panel lives under this single, non-obvious route segment.
// The public site never links to it; the middleware, auth guards and OAuth
// callback all derive their paths from this constant.
export const ADMIN_PATH = "/dawdi-admin-7K9X";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;
export const ADMIN_RESET_PATH = `${ADMIN_PATH}/reset-password`;
export const ADMIN_CALLBACK_PATH = `${ADMIN_PATH}/callback`;

// Defaults — overridden by the `settings` table once Supabase is connected.
export const DEFAULT_SETTINGS = {
  cafe: {
    name: "DAWDI CAFE",
    tagline: "Coffee for the Road",
    description: "Premium coffee, crêpes, snacks and quality drinks in Morocco.",
    logo_url: "/logo/logo.png",
    favicon: "/logo/logo.png",
    hero_image: "/logo/logo.png",
  },
  contact: {
    phone: "+212 656480972",
    whatsapp: "212656480972",
    email: "contact@dawdicafe.com",
    instagram: "https://www.instagram.com/cafe_dawdi/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    maps_url: "https://maps.app.goo.gl/z2hZuQ2UtCsZoZDGA",
    address: "Morocco",
  },
  hours: {
    weekdays: "8:00 AM - 11:00 PM",
    weekends: "9:00 AM - 12:00 AM",
  },
  seo: {
    title: "DAWDI CAFE — Coffee for the Road",
    description: "Premium coffee, crêpes, snacks and quality drinks in Morocco.",
    keywords: "coffee, cafe, morocco, crêpes, dawdi, coffee shop, maroc",
    og_image: "/logo/logo.png",
  },
  design: {
    primary_color: "#ff6b00",
  },
  footer: {
    about:
      "Premium coffee, crêpes, snacks and quality drinks. Fresh, fast, and friendly service in Morocco.",
    copyright: "© {year} DAWDI CAFE. All rights reserved.",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const PHONE = DEFAULT_SETTINGS.contact.phone;
export const WHATSAPP_NUMBER = DEFAULT_SETTINGS.contact.whatsapp;
export const INSTAGRAM_URL = DEFAULT_SETTINGS.contact.instagram;
export const GOOGLE_MAPS_URL = DEFAULT_SETTINGS.contact.maps_url;
export const ADDRESS = DEFAULT_SETTINGS.contact.address;
export const WORKING_HOURS = DEFAULT_SETTINGS.hours;

export const ADMIN_ROLE_LABELS = {
  super_admin: "Super Admin",
  manager: "Manager",
  employee: "Employee",
} as const;
