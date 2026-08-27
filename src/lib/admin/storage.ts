// Server-only helpers for safe Supabase Storage lifecycle management.
// Centralizes URL validation and orphan-safe deletion so no action duplicates
// the parsing logic and no arbitrary/static URL can ever be sent to deletion.
import { STORAGE_BUCKET } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

const PUBLIC_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

// True only for URLs that point at THIS project's configured Storage bucket.
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    return new URL(url).pathname.includes(PUBLIC_MARKER);
  } catch {
    return false;
  }
}

// Extracts the object path from a valid bucket public URL, or null when the URL
// does not belong to our bucket (covers /public assets and external URLs).
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!isSupabaseStorageUrl(url)) return null;
  const idx = (url as string).indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;
  let path = (url as string).slice(idx + PUBLIC_MARKER.length).split("?")[0];
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep raw if decoding fails
  }
  return path || null;
}

// Deletes a Storage object only if the URL belongs to our bucket. Refuses
// static local assets (/logo/logo.png) and any external URL. Returns true when
// an actual deletion was attempted successfully.
export async function deleteStorageImage(url: string | null | undefined): Promise<boolean> {
  const path = extractStoragePath(url);
  if (!path) return false;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    if (error) {
      console.error("[storage] failed to delete orphaned image:", path, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[storage] exception deleting image:", path, e);
    return false;
  }
}

// Checks whether a given image URL is still referenced by another row in a
// table/column. Used to avoid deleting images shared across records.
export async function isImageReferencedInTable(
  table: string,
  column: string,
  url: string,
  excludeId?: string
): Promise<boolean> {
  if (!url) return false;
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq(column, url);
    if (excludeId) query = query.neq("id", excludeId);
    const { count, error } = await query;
    if (error) {
      console.error("[storage] reference check error:", error.message);
      return true; // be safe: assume still referenced
    }
    return (count ?? 0) > 0;
  } catch (e) {
    console.error("[storage] reference check exception:", e);
    return true;
  }
}
