"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const IMAGE_BUCKET = "images";
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml"]);

// Called from client forms via `uploadImage(new FormData())`.
export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authorized" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided" };
  if (file.size > MAX_SIZE) return { error: "Image must be 8 MB or smaller" };
  if (!ALLOWED.has(file.type)) return { error: "Unsupported image type" };

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

// Delete an object from the images bucket by its public URL (no-op when the
// url is not hosted on Supabase Storage).
export async function deleteImage(url: string): Promise<{ error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authorized" };
  }

  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return {};

  const path = url.slice(index + marker.length).split("?")[0];
  const supabase = await createClient();
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  if (error) return { error: error.message };
  return {};
}
