import { z } from "zod";

// ---------- ORDERS ----------
export const orderItemSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(1),
});

export const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Name is required"),
  customer_phone: z.string().trim().min(7, "Phone is required"),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  total: z.coerce.number().min(0),
  notes: z.string().trim().optional().default(""),
});

// ---------- RESERVATIONS ----------
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().min(7, "Phone is required"),
  guests: z.coerce.number().int().min(1).max(50, "Guests must be between 1 and 50"),
  date: z.string().min(10, "Date is required"),
  time: z.string().min(4, "Time is required"),
  notes: z.string().trim().optional().default(""),
});

// ---------- MESSAGES ----------
export const messageSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional().default(""),
  subject: z.string().trim().optional().default(""),
  message: z.string().trim().min(5, "Message is required"),
});
