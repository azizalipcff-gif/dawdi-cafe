import { createClient } from "@/lib/supabase/server";
const BUCKET = "media";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function ensureBucket() {
  const supabase = await createClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
  return BUCKET;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid image type. Use JPG, PNG, WEBP or GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Image too large. Max size is 8MB.");
  }

  const supabase = await createClient();
  await ensureBucket();

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(publicUrl: string) {
  const supabase = await createClient();
  const url = new URL(publicUrl);
  const parts = url.pathname.split("/");
  const path = parts.slice(parts.indexOf(BUCKET) + 1).join("/");
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function getImageUrlFromPath(path: string): Promise<string> {
  const supabase = await createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function isProductImage(url: string | null | undefined): url is string {
  return typeof url === "string" && url.length > 0;
}
