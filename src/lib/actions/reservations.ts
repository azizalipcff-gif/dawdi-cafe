"use server";

import { createClient } from "@/lib/supabase/server";
import { reservationSchema } from "@/lib/validation";
import { getClientIp, rateLimitPublic, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

// Public: create a reservation
export async function createReservation(formData: FormData) {
  const rl = await rateLimitPublic(await getClientIp(), "reservation");
  if (!rl.success) return { error: RATE_LIMIT_MESSAGE };

  const parsed = reservationSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    guests: formData.get("guests"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert({
    ...parsed.data,
    notes: parsed.data.notes || null,
  });
  if (error) return { error: error.message };
  return { success: true };
}
