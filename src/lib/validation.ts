import { z } from "zod";

// ---------- AUTH ----------
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ---------- PRODUCTS ----------
export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().optional().default(""),
  category_id: z.string().uuid().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  discount: z.coerce.number().min(0, "Discount must be positive").optional().default(0),
  ingredients: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !v.trim()) return [] as string[];
      return v
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }),
  image_url: z.string().trim().optional().default(""),
  is_available: z.coerce.boolean().optional().default(true),
  is_featured: z.coerce.boolean().optional().default(false),
  is_recommended: z.coerce.boolean().optional().default(false),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
  translations: z.string().optional().transform((v) => {
    if (!v || !v.trim()) return {} as Record<string, { en?: string; fr?: string; ar?: string }>;
    try {
      return JSON.parse(v) as Record<string, { en?: string; fr?: string; ar?: string }>;
    } catch {
      return {};
    }
  }),
});

// ---------- CATEGORIES ----------
export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z.string().trim().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug"),
  description: z.string().trim().optional().default(""),
  image_url: z.string().trim().optional().default(""),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
  is_active: z.coerce.boolean().optional().default(true),
  translations: z.string().optional().transform((v) => {
    if (!v || !v.trim()) return {} as Record<string, { en?: string; fr?: string; ar?: string }>;
    try {
      return JSON.parse(v) as Record<string, { en?: string; fr?: string; ar?: string }>;
    } catch {
      return {};
    }
  }),
});

// ---------- GALLERY ----------
export const gallerySchema = z.object({
  title: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  image_url: z.string().trim().min(1, "Image is required"),
  category: z.string().trim().optional().default(""),
  is_featured: z.coerce.boolean().optional().default(false),
  is_active: z.coerce.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
  translations: z.string().optional().transform((v) => {
    if (!v || !v.trim()) return {} as Record<string, { en?: string; fr?: string; ar?: string }>;
    try {
      return JSON.parse(v) as Record<string, { en?: string; fr?: string; ar?: string }>;
    } catch {
      return {};
    }
  }),
});

// ---------- RESERVATIONS ----------
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().min(7, "Phone is required"),
  guests: z.coerce.number().int().min(1).max(50, "Guests must be between 1 and 50"),
  date: z.string().min(10, "Date is required"),
  time: z.string().min(4, "Time is required"),
  notes: z.string().trim().optional().default(""),
});

export const reservationStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed", "cancelled"]),
});

// ---------- ORDERS ----------
export const orderItemSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(1),
});

export const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Name is required"),
  customer_phone: z.string().trim().min(7, "Phone is required"),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  total: z.coerce.number().min(0),
  notes: z.string().trim().optional().default(""),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]),
});

// ---------- MESSAGES ----------
export const messageSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional().default(""),
  subject: z.string().trim().optional().default(""),
  message: z.string().trim().min(5, "Message is required"),
});

// ---------- TESTIMONIALS ----------
export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  role: z.string().trim().optional().default(""),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  content: z.string().trim().min(5, "Content is required"),
  is_active: z.coerce.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
});

// ---------- SETTINGS ----------
export const settingsSchema = z.object({
  cafe: z.object({
    name: z.string().trim().min(1),
    tagline: z.string().trim().optional().default(""),
    description: z.string().trim().optional().default(""),
    logo_url: z.string().trim().optional().default("/logo/logo.png"),
    favicon: z.string().trim().optional().default("/logo/logo.png"),
    hero_image: z.string().trim().optional().default(""),
  }),
  contact: z.object({
    phone: z.string().trim().min(7),
    whatsapp: z.string().trim().optional().default(""),
    email: z.string().trim().email().optional().default(""),
    instagram: z.string().trim().optional().default(""),
    facebook: z.string().trim().optional().default(""),
    tiktok: z.string().trim().optional().default(""),
    maps_url: z.string().trim().optional().default(""),
    address: z.string().trim().optional().default(""),
  }),
  hours: z.object({
    weekdays: z.string().trim().optional().default(""),
    weekends: z.string().trim().optional().default(""),
  }),
  seo: z.object({
    title: z.string().trim().optional().default(""),
    description: z.string().trim().optional().default(""),
    keywords: z.string().trim().optional().default(""),
    og_image: z.string().trim().optional().default(""),
  }),
  design: z.object({
    primary_color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional().default("#ff6b00"),
  }),
  footer: z.object({
    about: z.string().trim().optional().default(""),
    copyright: z.string().trim().optional().default(""),
  }),
});

// ---------- HERO SLIDES ----------
export const heroSlideSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  subtitle: z.string().trim().optional().default(""),
  image_url: z.string().trim().min(1, "Image is required"),
  button_label: z.string().trim().optional().default(""),
  button_url: z.string().trim().optional().default(""),
  overlay_opacity: z.coerce.number().int().min(0).max(100).optional().default(40),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
  is_active: z.coerce.boolean().optional().default(true),
  translations: z.string().optional().transform((v) => {
    if (!v || !v.trim()) return {} as Record<string, { en?: string; fr?: string; ar?: string }>;
    try {
      return JSON.parse(v) as Record<string, { en?: string; fr?: string; ar?: string }>;
    } catch {
      return {};
    }
  }),
});

// ---------- ALBUMS ----------
export const albumSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z.string().trim().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug"),
  description: z.string().trim().optional().default(""),
  cover_url: z.string().trim().optional().default(""),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
  is_active: z.coerce.boolean().optional().default(true),
  translations: z.string().optional().transform((v) => {
    if (!v || !v.trim()) return {} as Record<string, { en?: string; fr?: string; ar?: string }>;
    try {
      return JSON.parse(v) as Record<string, { en?: string; fr?: string; ar?: string }>;
    } catch {
      return {};
    }
  }),
});

// ---------- ADMIN USERS ----------
export const adminUserSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(["super_admin", "manager", "employee"]),
});
