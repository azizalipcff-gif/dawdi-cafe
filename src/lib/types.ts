// Shared TypeScript types matching the Supabase schema

// Optional per-language overrides stored in a `translations` jsonb column.
// English lives in the base columns; fr/ar override them when present.
export interface Translations {
  [field: string]: { en?: string; fr?: string; ar?: string } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  translations?: Translations | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  ingredients: string[] | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  translations?: Translations | null;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  translations?: Translations | null;
}

export type ReservationStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export interface OrderItem {
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_replied?: boolean;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  content: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  translations?: Translations | null;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  value_fr: Record<string, unknown> | null;
  value_ar: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// Aggregated settings bundle
export interface SiteSettings {
  cafe: {
    name: string;
    tagline: string;
    description: string;
    logo_url: string;
    favicon: string;
    hero_image: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    maps_url: string;
    address: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    og_image: string;
  };
  design: {
    primary_color: string;
  };
  footer: {
    about: string;
    copyright: string;
  };
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_label: string | null;
  button_url: string | null;
  overlay_opacity: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  translations?: Translations | null;
}

export interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  translations?: Translations | null;
}
