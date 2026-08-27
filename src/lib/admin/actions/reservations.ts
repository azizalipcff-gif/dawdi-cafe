"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ReservationStatus } from "@/lib/types";
import { revalidateAdmin, isValidId, dbError } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid reservation id." };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("id", id)
    .single();
  if (!existing) return { error: "Reservation not found." };

  const { error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return dbError(error);

  revalidateAdmin();
  return {};
}

export async function deleteReservation(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid reservation id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("reservations")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return dbError(error);
  if (count === 0) return { error: "Reservation not found." };

  revalidateAdmin();
  return {};
}
