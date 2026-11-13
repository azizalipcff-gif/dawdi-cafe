"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const orderSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(7).max(30),
  targetUsername: z.string().trim().max(160).optional().default(""),
  targetLink: z.string().trim().max(500).optional().default(""),
  quantity: z.number().int().min(1).max(50),
  notes: z.string().trim().max(1000).optional().default(""),
});

export async function submitServiceOrder(input: unknown): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "راجع المعلومات المدخلة وحاول مرة أخرى." };
  const values = parsed.data;
  const supabase = await createClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id,name,price,status,is_available,package_quantity,platform")
    .eq("id", values.productId)
    .eq("status", "published")
    .eq("is_available", true)
    .single();
  if (productError || !product) return { ok: false, error: "هاد الباقة ما بقاتش متاحة. حدّث الصفحة وجرب من جديد." };

  const price = Number(product.price);
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "ثمن الباقة غير صالح. تواصل مع الإدارة." };
  const total = Math.round(price * values.quantity * 100) / 100;
  const { data: order, error } = await supabase.from("orders").insert({
    customer_name: values.customerName,
    customer_phone: values.customerPhone,
    customer_email: null,
    items: [{
      product_id: product.id,
      name: product.name,
      price,
      quantity: values.quantity,
    }],
    total,
    notes: values.notes || null,
    status: "pending",
    target_username: values.targetUsername || null,
    target_link: values.targetLink || null,
    payment_status: "unpaid",
    delivery_details: {
      platform: product.platform || null,
      package_quantity: product.package_quantity || null,
      package_count: values.quantity,
    },
  }).select("id").single();

  if (error || !order) return { ok: false, error: "ما قدرناش نسجلو الطلب دابا. عاود المحاولة بعد قليل." };
  return { ok: true, orderId: order.id };
}
