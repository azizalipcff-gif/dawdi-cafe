"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ReservationStatus } from "@/lib/types";
import { revalidateAdmin } from "./shared";

function isValidId(id: string): boolean {
  return typeof id === "string" && id.trim().length > 0;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<{ error?: string }> {
  await requireAdmin();
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
  if (error) return { error: error.message };

  revalidateAdmin();
  return {};
}

export async function deleteReservation(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!isValidId(id)) return { error: "Invalid reservation id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("reservations")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (count === 0) return { error: "Reservation not found." };

  revalidateAdmin();
  return {};
}
