"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKET } from "@/lib/constants";
import { extractStoragePath, deleteStorageImage } from "@/lib/admin/storage";
import { dbError } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// Called from client forms via `uploadImage(new FormData())`.
export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  // requireAdmin() may throw a redirect (NEXT_REDIRECT) for non-admins. Do NOT
  // catch it here — letting it propagate is the intended auth behavior.
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "upload");

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided" };
  if (file.size > MAX_SIZE) return { error: "Image must be 8 MB or smaller" };
  if (!ALLOWED.has(file.type)) return { error: "Unsupported image type" };

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) return dbError(error);

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    console.error("[storage] upload failed:", e);
    return { error: "Upload failed. Please try again." };
  }
}

// Delete an object from the images bucket by its public URL. Refuses URLs that
// are not hosted on this project's Supabase Storage (no-op for /public assets
// or external URLs). Caller must ensure the image is no longer referenced.
export async function deleteImage(url: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  const path = extractStoragePath(url);
  if (!path) return {};
  const deleted = await deleteStorageImage(url);
  if (!deleted) return { error: "Failed to delete image" };
  return {};
}
