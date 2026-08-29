// Server-side input validation for admin write actions.
//
// Client forms are trusted only as far as the browser enforces; a crafted
// request can send anything. Every mutating action funnels its payload through
// one of the validators below so we guarantee types, bounds, and that only
// well-formed values reach Supabase.
//
// Each validator takes `requireAll`:
//   - create flows pass true  → every field must be present and valid.
//   - update (patch) flows pass false → absent fields are skipped entirely
//     (never overwritten), only the fields actually supplied are validated.

import { PRODUCT_STATUSES, type ProductStatus } from "@/lib/types";

// A single field result is one of: a valid value, "skip" (field not supplied,
// leave it untouched), or an error.
type FieldResult<T> =
  | { status: "ok"; value: T }
  | { status: "skip" }
  | { status: "error"; error: string };

const okField = <T>(value: T): FieldResult<T> => ({ status: "ok", value });
const skipField = (): FieldResult<never> => ({ status: "skip" });
const errField = (error: string): FieldResult<never> => ({ status: "error", error });

// IDs in this project are uuids or short slugs — alphanumeric, dash, underscore.
const ID_RE = /^[A-Za-z0-9_-]{1,100}$/;

interface StrOpts {
  field: string;
  required?: boolean;
  max?: number;
  requireAll: boolean;
}
function strField(v: unknown, opts: StrOpts): FieldResult<string | null> {
  const max = opts.max ?? 2000;
  if (v === undefined) {
    if (opts.required && opts.requireAll) return errField(`${opts.field} is required.`);
    return skipField();
  }
  if (v === null || v === "") {
    if (opts.required) return errField(`${opts.field} is required.`);
    return okField(null);
  }
  if (typeof v !== "string") return errField(`${opts.field} must be text.`);
  if (v.length > max) return errField(`${opts.field} is too long (max ${max}).`);
  if (opts.required && v.trim().length === 0) return errField(`${opts.field} is required.`);
  return okField(v);
}

interface NumOpts {
  field: string;
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  requireAll: boolean;
}
function numField(v: unknown, opts: NumOpts): FieldResult<number> {
  if (v === undefined) {
    if (opts.required && opts.requireAll) return errField(`${opts.field} is required.`);
    return skipField();
  }
  if (v === null || v === "") {
    if (opts.required) return errField(`${opts.field} is required.`);
    return skipField();
  }
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return errField(`${opts.field} must be a number.`);
  if (opts.integer && !Number.isInteger(n)) return errField(`${opts.field} must be a whole number.`);
  if (opts.min !== undefined && n < opts.min) return errField(`${opts.field} must be ≥ ${opts.min}.`);
  if (opts.max !== undefined && n > opts.max) return errField(`${opts.field} must be ≤ ${opts.max}.`);
  return okField(n);
}

function boolField(v: unknown, opts: { field: string }): FieldResult<boolean> {
  if (v === undefined) return skipField();
  if (typeof v === "boolean") return okField(v);
  if (v === "true") return okField(true);
  if (v === "false") return okField(false);
  return errField(`${opts.field} must be true or false.`);
}

// Restrict product status to the known moderation states. Only accepts values
// from PRODUCT_STATUSES; never lets an unknown string reach the database.
function statusField(v: unknown, opts: { field: string; requireAll: boolean }): FieldResult<ProductStatus> {
  if (v === undefined) {
    if (opts.requireAll) return errField(`${opts.field} is required.`);
    return skipField();
  }
  if (typeof v !== "string" || !PRODUCT_STATUSES.includes(v as ProductStatus)) {
    return errField(`${opts.field} must be one of: ${PRODUCT_STATUSES.join(", ")}.`);
  }
  return okField(v as ProductStatus);
}

interface IdOpts {
  field: string;
  requireAll: boolean;
}
function idField(v: unknown, opts: IdOpts): FieldResult<string | null> {
  if (v === undefined) return opts.requireAll ? errField(`${opts.field} is required.`) : skipField();
  if (v === null || v === "") return okField(null);
  if (typeof v !== "string") return errField(`${opts.field} is invalid.`);
  if (!ID_RE.test(v)) return errField(`${opts.field} is invalid.`);
  return okField(v);
}

interface ArrOpts {
  field: string;
  requireAll: boolean;
  max?: number;
  itemMax?: number;
}
function arrayField(v: unknown, opts: ArrOpts): FieldResult<string[]> {
  const max = opts.max ?? 200;
  const itemMax = opts.itemMax ?? 200;
  if (v === undefined) return opts.requireAll ? okField([]) : skipField();
  if (v === null) return okField([]);
  if (!Array.isArray(v)) return errField(`${opts.field} must be a list.`);
  if (v.length > max) return errField(`${opts.field} has too many items.`);
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== "string") return errField(`${opts.field} must only contain text.`);
    out.push(item.slice(0, itemMax));
  }
  return okField(out);
}

interface ObjOpts {
  field: string;
  requireAll: boolean;
}
function objectField(v: unknown, opts: ObjOpts): FieldResult<Record<string, unknown> | null> {
  if (v === undefined) return opts.requireAll ? okField({}) : skipField();
  if (v === null) return okField(null);
  if (typeof v !== "object" || Array.isArray(v)) return errField(`${opts.field} must be an object.`);
  return okField(v as Record<string, unknown>);
}

// Image URLs come from Storage uploads (absolute https URLs) or are null, but
// static defaults in settings are relative paths ("/logo/logo.png"). Accept
// either form; reject anything that could be a javascript:/data: URL etc.
interface ImgOpts {
  field?: string;
  required?: boolean;
  requireAll: boolean;
}
function imageUrlField(v: unknown, opts: ImgOpts): FieldResult<string | null> {
  const field = opts.field ?? "Image";
  if (v === undefined) {
    if (opts.required && opts.requireAll) return errField(`${field} is required.`);
    return skipField();
  }
  if (v === null || v === "") {
    if (opts.required) return errField(`${field} is required.`);
    return okField(null);
  }
  if (typeof v !== "string") return errField(`${field} must be a URL.`);
  if (v.length > 2048) return errField(`${field} URL is too long.`);
  if (v.startsWith("/")) return okField(v);
  let url: URL;
  try {
    url = new URL(v);
  } catch {
    return errField(`${field} must be a valid URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return errField(`${field} must be an http(s) URL.`);
  }
  return okField(v);
}

function hrefField(v: unknown, opts: { field: string }): FieldResult<string | null> {
  if (v === undefined) return skipField();
  if (v === null || v === "") return okField(null);
  if (typeof v !== "string") return errField(`${opts.field} must be text.`);
  if (v.length > 500) return errField(`${opts.field} is too long.`);
  if (v.startsWith("/") || v.startsWith("#")) return okField(v);
  try {
    const u = new URL(v);
    if (u.protocol === "http:" || u.protocol === "https:") return okField(v);
  } catch {
    /* fall through to error */
  }
  return errField(`${opts.field} must be a path or http(s) URL.`);
}

function emailField(v: unknown, opts: { field: string }): FieldResult<string | null> {
  if (v === undefined) return skipField();
  if (v === null || v === "") return okField(null);
  if (typeof v !== "string") return errField(`${opts.field} must be text.`);
  if (v.length > 320) return errField(`${opts.field} is too long.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return errField(`${opts.field} is not a valid email.`);
  return okField(v);
}

function urlField(v: unknown, opts: { field: string }): FieldResult<string | null> {
  if (v === undefined) return skipField();
  if (v === null || v === "") return okField(null);
  if (typeof v !== "string") return errField(`${opts.field} must be text.`);
  if (v.length > 2048) return errField(`${opts.field} is too long.`);
  try {
    const u = new URL(v);
    if (u.protocol === "http:" || u.protocol === "https:") return okField(v);
  } catch {
    /* fall through */
  }
  return errField(`${opts.field} must be a valid http(s) URL.`);
}

// Build the cleaned output object from a list of [key, result] pairs, returning
// either the object or a joined error string.
function build(
  pairs: [string, FieldResult<unknown>][]
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const out: Record<string, unknown> = {};
  const errs: string[] = [];
  for (const [key, r] of pairs) {
    if (r.status === "error") errs.push(r.error);
    else if (r.status === "ok") out[key] = r.value;
  }
  if (errs.length) return { ok: false, error: errs.join(" ") };
  return { ok: true, value: out };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export function validateProduct(
  raw: Record<string, unknown>,
  requireAll: boolean
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const name = strField(raw.name, { field: "Name", required: true, max: 150, requireAll });
  const description = strField(raw.description, { field: "Description", max: 4000, requireAll });
  const price = numField(raw.price, { field: "Price", required: true, min: 0, max: 1_000_000, requireAll });
  const discount = numField(raw.discount, { field: "Discount", min: 0, max: 100, requireAll });
  const ingredients = arrayField(raw.ingredients, { field: "Ingredients", requireAll });
  const image_url = imageUrlField(raw.image_url, { requireAll });
  const category_id = idField(raw.category_id, { field: "Category", requireAll });
  const is_available = boolField(raw.is_available, { field: "Available" });
  const is_featured = boolField(raw.is_featured, { field: "Featured" });
  const is_recommended = boolField(raw.is_recommended, { field: "Recommended" });
  const status = statusField(raw.status, { field: "Status", requireAll });
  const sort_order = numField(raw.sort_order, { field: "Sort order", integer: true, min: 0, max: 1_000_000, requireAll });
  const translations = objectField(raw.translations, { field: "Translations", requireAll });

  const res = build([
    ["name", name as FieldResult<unknown>],
    ["description", description as FieldResult<unknown>],
    ["price", price as FieldResult<unknown>],
    ["discount", discount as FieldResult<unknown>],
    ["ingredients", ingredients as FieldResult<unknown>],
    ["image_url", image_url as FieldResult<unknown>],
    ["category_id", category_id as FieldResult<unknown>],
    ["is_available", is_available as FieldResult<unknown>],
    ["is_featured", is_featured as FieldResult<unknown>],
    ["is_recommended", is_recommended as FieldResult<unknown>],
    ["status", status as FieldResult<unknown>],
    ["sort_order", sort_order as FieldResult<unknown>],
    ["translations", translations as FieldResult<unknown>],
  ]);
  if (!res.ok) return res;
  // Publishing a product makes it publicly visible, so require a complete,
  // public-ready record. We only enforce fields the caller is actively setting
  // in this request (in a create flow all are present; in a publish patch the
  // description/category are usually already stored, so we don't block a simple
  // status toggle of an already-complete product).
  if (res.value.status === "published") {
    if (raw.description !== undefined) {
      const d = res.value.description;
      if (!d || (typeof d === "string" && d.trim().length === 0)) {
        return { ok: false, error: "Description is required before publishing." };
      }
    }
    if (raw.category_id !== undefined && !res.value.category_id) {
      return { ok: false, error: "Category is required before publishing." };
    }
  }
  // Ensure jsonb columns always have a value on create.
  if (res.value.translations === undefined) res.value.translations = {};
  return res;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export function validateCategory(
  raw: Record<string, unknown>,
  requireAll: boolean
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const name = strField(raw.name, { field: "Name", required: true, max: 150, requireAll });
  let slug: FieldResult<string | null> = skipField();
  if (raw.slug !== undefined && raw.slug !== null && raw.slug !== "") {
    if (typeof raw.slug !== "string") slug = errField("Slug must be text.");
    else if (raw.slug.length > 200) slug = errField("Slug is too long.");
    else if (!/^[a-z0-9-]+$/.test(raw.slug)) slug = errField("Slug may only contain lowercase letters, numbers and dashes.");
    else slug = okField(raw.slug);
  }
  const description = strField(raw.description, { field: "Description", max: 4000, requireAll });
  const image_url = imageUrlField(raw.image_url, { requireAll });
  const sort_order = numField(raw.sort_order, { field: "Sort order", integer: true, min: 0, max: 1_000_000, requireAll });
  const is_active = boolField(raw.is_active, { field: "Active" });
  const translations = objectField(raw.translations, { field: "Translations", requireAll });

  const res = build([
    ["name", name as FieldResult<unknown>],
    ["slug", slug as FieldResult<unknown>],
    ["description", description as FieldResult<unknown>],
    ["image_url", image_url as FieldResult<unknown>],
    ["sort_order", sort_order as FieldResult<unknown>],
    ["is_active", is_active as FieldResult<unknown>],
    ["translations", translations as FieldResult<unknown>],
  ]);
  if (!res.ok) return res;
  if (res.value.translations === undefined) res.value.translations = {};
  return res;
}

// ---------------------------------------------------------------------------
// Gallery items
// ---------------------------------------------------------------------------
export function validateGalleryItem(
  raw: Record<string, unknown>,
  requireAll: boolean
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const title = strField(raw.title, { field: "Title", max: 200, requireAll });
  const description = strField(raw.description, { field: "Description", max: 2000, requireAll });
  const category = strField(raw.category, { field: "Category", max: 100, requireAll });
  const image_url = imageUrlField(raw.image_url, { field: "Image", required: true, requireAll });
  const is_featured = boolField(raw.is_featured, { field: "Featured" });
  const is_active = boolField(raw.is_active, { field: "Active" });
  const sort_order = numField(raw.sort_order, { field: "Sort order", integer: true, min: 0, max: 1_000_000, requireAll });
  const translations = objectField(raw.translations, { field: "Translations", requireAll });

  const res = build([
    ["title", title as FieldResult<unknown>],
    ["description", description as FieldResult<unknown>],
    ["category", category as FieldResult<unknown>],
    ["image_url", image_url as FieldResult<unknown>],
    ["is_featured", is_featured as FieldResult<unknown>],
    ["is_active", is_active as FieldResult<unknown>],
    ["sort_order", sort_order as FieldResult<unknown>],
    ["translations", translations as FieldResult<unknown>],
  ]);
  if (!res.ok) return res;
  if (res.value.translations === undefined) res.value.translations = {};
  return res;
}

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------
export function validateHeroSlide(
  raw: Record<string, unknown>,
  requireAll: boolean
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const title = strField(raw.title, { field: "Title", required: true, max: 150, requireAll });
  const subtitle = strField(raw.subtitle, { field: "Subtitle", max: 300, requireAll });
  const image_url = imageUrlField(raw.image_url, { field: "Image", required: true, requireAll });
  const button_label = strField(raw.button_label, { field: "Button label", max: 100, requireAll });
  const button_url = hrefField(raw.button_url, { field: "Button URL" });
  const overlay_opacity = numField(raw.overlay_opacity, { field: "Overlay opacity", required: true, integer: true, min: 0, max: 100, requireAll });
  const sort_order = numField(raw.sort_order, { field: "Sort order", integer: true, min: 0, max: 1_000_000, requireAll });
  const is_active = boolField(raw.is_active, { field: "Active" });
  const translations = objectField(raw.translations, { field: "Translations", requireAll });

  const res = build([
    ["title", title as FieldResult<unknown>],
    ["subtitle", subtitle as FieldResult<unknown>],
    ["image_url", image_url as FieldResult<unknown>],
    ["button_label", button_label as FieldResult<unknown>],
    ["button_url", button_url as FieldResult<unknown>],
    ["overlay_opacity", overlay_opacity as FieldResult<unknown>],
    ["sort_order", sort_order as FieldResult<unknown>],
    ["is_active", is_active as FieldResult<unknown>],
    ["translations", translations as FieldResult<unknown>],
  ]);
  if (!res.ok) return res;
  if (res.value.translations === undefined) res.value.translations = {};
  return res;
}

// ---------------------------------------------------------------------------
// Settings (nested patch: { cafe?: {...}, contact?: {...}, ... })
// ---------------------------------------------------------------------------
const SETTINGS_TEXT_FIELDS: Record<string, string[]> = {
  cafe: ["name", "tagline", "favicon", "description"],
  contact: ["phone", "whatsapp", "address"],
  hours: ["weekdays", "weekends"],
  footer: ["about", "copyright"],
};

function validateSettingsSection(
  section: string,
  raw: unknown
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (raw === null || raw === undefined) return { ok: true, value: {} };
  if (typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: `Settings "${section}" must be an object.` };
  const obj = raw as Record<string, unknown>;
  const pairs: [string, FieldResult<unknown>][] = [];

  for (const f of SETTINGS_TEXT_FIELDS[section] ?? []) {
    pairs.push([f, strField(obj[f], { field: `${section}.${f}`, max: 2000, requireAll: false }) as FieldResult<unknown>]);
  }
  if (section === "cafe") {
    for (const f of ["logo_url", "hero_image"] as const) {
      pairs.push([f, imageUrlField(obj[f], { field: `${section}.${f}`, requireAll: false }) as FieldResult<unknown>]);
    }
  }
  if (section === "contact") {
    for (const f of ["email"] as const) {
      pairs.push([f, emailField(obj[f], { field: `${section}.${f}` }) as FieldResult<unknown>]);
    }
    for (const f of ["maps_url", "instagram", "facebook", "tiktok"] as const) {
      pairs.push([f, urlField(obj[f], { field: `${section}.${f}` }) as FieldResult<unknown>]);
    }
  }
  return build(pairs);
}

export function validateSettings(
  raw: Record<string, unknown>
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const out: Record<string, unknown> = {};
  const errs: string[] = [];
  // Only the sections exposed by the admin UI are writable here. Any other key
  // (e.g. seo/design, which the UI never edits) is rejected, never blindly
  // upserted, so a crafted payload cannot wipe or inject arbitrary settings rows.
  const allowed = ["cafe", "contact", "hours", "footer"];

  for (const key of Object.keys(raw)) {
    if (!allowed.includes(key)) {
      errs.push(`Unknown settings section "${key}".`);
      continue;
    }
    const r = validateSettingsSection(key, raw[key]);
    if (!r.ok) errs.push(r.error);
    else Object.assign(out, r.value);
  }
  if (errs.length) return { ok: false, error: errs.join(" ") };
  return { ok: true, value: out };
}
