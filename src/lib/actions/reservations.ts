"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reservationSchema, reservationStatusSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import type { ReservationStatus } from "@/lib/types";

// Public: create a reservation
export async function createReservation(formData: FormData) {
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

// Admin: update reservation status
export async function updateReservationStatus(id: string, status: ReservationStatus) {
  await requireRole(["super_admin", "manager", "employee"]);

  const parsed = reservationStatusSchema.safeParse({ status });
  if (!parsed.success) return { error: "Invalid status" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/reservations", "layout");
  return { success: true };
}

// Admin: delete reservation
export async function deleteReservation(id: string) {
  await requireRole(["super_admin", "manager", "employee"]);

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/reservations", "layout");
  return { success: true };
}
