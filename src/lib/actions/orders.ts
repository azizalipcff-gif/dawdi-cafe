"use server";

import { createClient } from "@/lib/supabase/server";
import { orderSchema } from "@/lib/validation";
import type { OrderItem } from "@/lib/types";
import { getClientIp, rateLimitPublic, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

// Public: place an order from the cart
export async function createOrder(formData: FormData) {
  const rl = await rateLimitPublic(await getClientIp(), "order");
  if (!rl.success) return { error: RATE_LIMIT_MESSAGE };

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Invalid cart data" };
  }

  const parsed = orderSchema.safeParse({
    customer_name: formData.get("customer_name"),
    customer_phone: formData.get("customer_phone"),
    items,
    total: formData.get("total"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert({
    customer_name: parsed.data.customer_name,
    customer_phone: parsed.data.customer_phone,
    items: parsed.data.items,
    total: parsed.data.total,
    notes: parsed.data.notes || null,
    status: "pending",
  });
  if (error) return { error: error.message };
  return { success: true };
}
