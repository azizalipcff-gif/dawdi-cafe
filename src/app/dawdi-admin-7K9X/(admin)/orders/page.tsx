"use client";

import { useMemo, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["pending", "preparing", "ready", "completed", "cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  preparing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ready: "bg-brand/15 text-brand border-brand/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q)
    );
  }, [orders, query]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [filtered]
  );

  const handleDelete = (order: Order) => {
    if (window.confirm(`Delete order ${order.id}?`)) {
      deleteOrder(order.id);
    }
  };

  const itemCount = (order: Order) =>
    order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Orders
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {orders.length} orders · {orders.filter((o) => o.status === "pending").length}{" "}
            pending
          </p>
        </div>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone or ID..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr className="text-xs uppercase tracking-wider text-zinc-400">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            )}
            {sorted.map((order) => (
              <tr key={order.id} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-mono text-xs text-zinc-300">{order.id}</p>
                  <p className="text-xs text-zinc-500">{formatDateTime(order.created_at)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-100">{order.customer_name}</p>
                  <p className="text-xs text-zinc-500">{order.customer_phone}</p>
                </td>
                <td className="px-4 py-3 text-zinc-300">
                  {itemCount(order)} ·{" "}
                  <span className="text-xs text-zinc-500">
                    {order.items.map((i) => i.name).join(", ")}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize outline-none",
                      STATUS_COLORS[order.status]
                    )}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleDelete(order)}
                      className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      aria-label="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
