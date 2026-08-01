import { cn } from "@/lib/utils";

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  preparing: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  ready: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  completed: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export const RESERVATION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  accepted: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  completed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function StatusPill({ status, colors }: { status: string; colors: Record<string, string> }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", colors[status])}>
      {status}
    </span>
  );
}
