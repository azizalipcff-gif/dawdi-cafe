"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKET } from "@/lib/constants";

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

  // ===== TEMP DEBUG (remove after diagnosing) =====
  console.error("[upload-debug] bucket name =", STORAGE_BUCKET);
  console.error("[upload-debug] supabase url =", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.error(
    "[upload-debug] service role key set =",
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    process.env.SUPABASE_SERVICE_ROLE_KEY ? `(length ${process.env.SUPABASE_SERVICE_ROLE_KEY.length})` : ""
  );
  console.error("[upload-debug] upload path =", path);
  console.error("[upload-debug] file =", { name: file.name, type: file.type, size: file.size });
  // =================================================

  const supabase = createAdminClient();

  // ===== TEMP DEBUG: confirm the target bucket exists =====
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    console.error(
      "[upload-debug] listBuckets =",
      JSON.stringify(buckets?.map((b) => b.name)),
      "error =",
      JSON.stringify(listErr)
    );
  } catch (e) {
    console.error("[upload-debug] listBuckets threw =", e);
  }
  // ========================================================

  const { data: uploadData, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  console.error("[upload-debug] upload data =", uploadData ? JSON.stringify(uploadData) : "null");
  console.error("[upload-debug] upload error =", error ? JSON.stringify(error) : "null");

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  console.error("[upload-debug] public url =", data.publicUrl);
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

  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return {};

  const path = url.slice(index + marker.length).split("?")[0];
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) return { error: error.message };
  return {};
}
