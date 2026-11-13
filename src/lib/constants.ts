export const SITE_NAME = "MOMIA STOR";
export const SITE_TAGLINE = "Your Digital Partner";
export const SITE_DESCRIPTION = "MOMIA STOR — social media growth, gaming top-ups and digital services.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momiastor.com";
export const ADMIN_PATH = "/dawdi-admin-7K9X";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;
export const STORAGE_BUCKET = "images";
export const DEFAULT_SETTINGS = {
  cafe: {
    name: "MOMIA STOR",
    tagline: "Your Digital Partner",
    description: SITE_DESCRIPTION,
    logo_url: "/logo/logo.png",
    favicon: "/logo/logo.png",
    hero_image: "/logo/logo.png",
  },
  contact: { phone: "", whatsapp: "", email: "", instagram: "", facebook: "", tiktok: "", maps_url: "", address: "Morocco" },
  hours: { weekdays: "Always online", weekends: "Always online" },
  seo: { title: "MOMIA STOR — Your Digital Partner", description: SITE_DESCRIPTION, keywords: "social media, followers, likes, gaming top up, Free Fire, digital services", og_image: "/logo/logo.png" },
  design: { primary_color: "#168BFF" },
  footer: { about: SITE_DESCRIPTION, copyright: "© {year} MOMIA STOR. All rights reserved." },
};
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how" },
] as const;
export const PHONE = "";
export const WHATSAPP_NUMBER = "";
export const INSTAGRAM_URL = "";
export const GOOGLE_MAPS_URL = "";
export const ADDRESS = "Morocco";
export const WORKING_HOURS = DEFAULT_SETTINGS.hours;
