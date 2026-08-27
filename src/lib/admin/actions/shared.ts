import { revalidatePath } from "next/cache";
import { ADMIN_PATH } from "@/lib/constants";

// Revalidate the entire admin tree so the layout refetches fresh data after
// any mutation.
export function revalidateAdmin() {
  revalidatePath(ADMIN_PATH, "layout");
}

// Reject obviously invalid ids before any privileged DB operation.
export function isValidId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 100;
}

// Keep only the explicitly allowed keys from a client-supplied patch so a
// caller cannot assign arbitrary columns (mass-assignment protection).
export function pickAllowed<T extends object>(
  obj: T,
  allowed: readonly string[]
): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key];
      if (value !== undefined) out[key] = value;
    }
  }
  return out as Partial<T>;
}

// Never surface raw Supabase/database error text to the browser. Log it
// server-side and return a generic, safe message instead.
export function dbError(error: unknown): { error: string } {
  if (error && typeof error === "object" && "message" in error) {
    console.error("[admin] db error:", (error as { message: string }).message);
  } else {
    console.error("[admin] db error:", error);
  }
  return { error: "A database error occurred. Please retry." };
}
