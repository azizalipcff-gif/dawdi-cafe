import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type {
  Category,
  GalleryItem,
  HeroSlide,
  Message,
  Order,
  Product,
  Reservation,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import type { AdminCustomer } from "./store";

export interface AdminData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  gallery: GalleryItem[];
  heroSlides: HeroSlide[];
  reservations: Reservation[];
  messages: Message[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  customers: AdminCustomer[];
}

function mergeSettings(rows: { key: string; value: Record<string, unknown> | null }[]): SiteSettings {
  const base: SiteSettings = {
    cafe: { ...DEFAULT_SETTINGS.cafe },
    contact: { ...DEFAULT_SETTINGS.contact },
    hours: { ...DEFAULT_SETTINGS.hours },
    seo: { ...DEFAULT_SETTINGS.seo },
    design: { ...DEFAULT_SETTINGS.design },
    footer: { ...DEFAULT_SETTINGS.footer },
  };

  for (const row of rows) {
    const key = row.key as keyof SiteSettings;
    if (key in base && row.value) {
      base[key] = { ...base[key], ...(row.value as Record<string, string>) } as never;
    }
  }
  return base;
}

function deriveCustomers(orders: Order[], profiles: { id: string; full_name: string | null; phone: string | null; created_at: string }[]): AdminCustomer[] {
  const customers: AdminCustomer[] = [];
  const seen = new Set<string>();

  for (const order of orders) {
    const key = `${order.customer_phone}|${order.customer_name}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    customers.push({
      id: order.id,
      name: order.customer_name,
      phone: order.customer_phone,
      email: "",
      created_at: order.created_at,
    });
  }

  for (const profile of profiles) {
    const phone = profile.phone ?? "";
    if (!phone || seen.has(phone.toLowerCase())) continue;
    seen.add(phone.toLowerCase());
    customers.push({
      id: profile.id,
      name: profile.full_name ?? "",
      phone,
      email: "",
      created_at: profile.created_at,
    });
  }

  return customers;
}

// Fetch every collection the admin panel needs in a single round-trip.
export const getAdminData = cache(async (): Promise<AdminData> => {
  const supabase = await createClient();

  const [
    products,
    categories,
    orders,
    gallery,
    heroSlides,
    reservations,
    messages,
    testimonials,
    settingsRes,
    profiles,
  ] = await Promise.all([
    supabase.from("products").select("*").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("gallery").select("*").order("sort_order"),
    supabase.from("hero_slides").select("*").order("sort_order"),
    supabase.from("reservations").select("*").order("created_at", { ascending: false }),
    supabase.from("messages").select("*").order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("settings").select("key, value"),
    supabase.from("profiles").select("id, full_name, phone, created_at"),
  ]);

  return {
    products: (products.data ?? []) as Product[],
    categories: (categories.data ?? []) as Category[],
    orders: (orders.data ?? []) as Order[],
    gallery: (gallery.data ?? []) as GalleryItem[],
    heroSlides: (heroSlides.data ?? []) as HeroSlide[],
    reservations: (reservations.data ?? []) as Reservation[],
    messages: (messages.data ?? []) as Message[],
    testimonials: (testimonials.data ?? []) as Testimonial[],
    settings: mergeSettings(
      (settingsRes.data ?? []) as { key: string; value: Record<string, unknown> | null }[]
    ),
    customers: deriveCustomers(
      (orders.data ?? []) as Order[],
      (profiles.data ?? []) as { id: string; full_name: string | null; phone: string | null; created_at: string }[]
    ),
  };
});
