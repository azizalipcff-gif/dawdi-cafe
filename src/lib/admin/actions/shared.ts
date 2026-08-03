import { revalidatePath } from "next/cache";
import { ADMIN_PATH } from "@/lib/constants";

// Revalidate the entire admin tree so the layout refetches fresh data after
// any mutation.
export function revalidateAdmin() {
  revalidatePath(ADMIN_PATH, "layout");
}
