import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `${Number(amount || 0).toFixed(2)} DH`;
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function buildWhatsAppHref(phone: string, message: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

// Only permit safe URL schemes when rendering a (possibly admin-controlled) link
// target. Blocks javascript:, data:, vbscript:, and other dangerous schemes that
// could be stored in settings and later rendered as an <a href>.
export function safeHref(url: string | null | undefined, fallback = "#"): string {
  if (typeof url !== "string" || url.trim() === "") return fallback;
  const trimmed = url.trim();
  if (
    /^(https?:\/\/|mailto:|tel:)/i.test(trimmed) ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  return fallback;
}
