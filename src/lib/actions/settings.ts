"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { settingsSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  await requireRole(["super_admin"]);

  const payload = {
    cafe: {
      name: formData.get("cafe.name"),
      tagline: formData.get("cafe.tagline"),
      description: formData.get("cafe.description"),
      logo_url: formData.get("cafe.logo_url"),
      favicon: formData.get("cafe.favicon"),
      hero_image: formData.get("cafe.hero_image"),
    },
    contact: {
      phone: formData.get("contact.phone"),
      whatsapp: formData.get("contact.whatsapp"),
      email: formData.get("contact.email"),
      instagram: formData.get("contact.instagram"),
      facebook: formData.get("contact.facebook"),
      tiktok: formData.get("contact.tiktok"),
      maps_url: formData.get("contact.maps_url"),
      address: formData.get("contact.address"),
    },
    hours: {
      weekdays: formData.get("hours.weekdays"),
      weekends: formData.get("hours.weekends"),
    },
    seo: {
      title: formData.get("seo.title"),
      description: formData.get("seo.description"),
      keywords: formData.get("seo.keywords"),
      og_image: formData.get("seo.og_image"),
    },
    design: {
      primary_color: formData.get("design.primary_color"),
    },
    footer: {
      about: formData.get("footer.about"),
      copyright: formData.get("footer.copyright"),
    },
  };

  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = createAdminClient();
  const sections = Object.entries(parsed.data) as [
    keyof typeof parsed.data,
    Record<string, unknown>
  ][];

  for (const [key, value] of sections) {
    const { error } = await supabase.from("settings").upsert(
      { key, value: value as object },
      { onConflict: "key" }
    );
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function uploadHeroImage(formData: FormData) {
  await requireRole(["super_admin"]);
  const file = formData.get("hero_image") as File | null;
  if (!file || file.size === 0) return { error: "No image provided" };

  const { uploadImage } = await import("@/lib/storage");
  try {
    const url = await uploadImage(file, "settings");
    revalidatePath("/", "layout");
    return { success: true, url };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
