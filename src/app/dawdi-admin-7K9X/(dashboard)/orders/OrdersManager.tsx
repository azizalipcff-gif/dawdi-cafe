"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/lib/types";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/orders";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_COLORS, StatusPill } from "@/components/admin/status";

const STATUSES: OrderStatus[] = ["pending", "preparing", "ready", "completed", "cancelled"];

export function OrdersManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = orders.filter(
    (o) =>
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.toLowerCase().includes(search.toLowerCase())
  );

  const run = async (fn: () => Promise<{ error?: string; success?: boolean }>, msg: string) => {
    const res = await fn();
    if (res?.error) toast.error(res.error);
    else {
      toast.success(msg);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted">{filtered.length} orders</span>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-12 bg-card border border-border rounded-xl">No orders found.</p>
        )}
        {filtered.map((order) => (
          <div key={order.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{order.customer_name}</p>
                  <p className="text-xs text-muted">{order.customer_phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground font-mono">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-muted">{formatDateTime(order.created_at)}</p>
                </div>
                <StatusPill status={order.status} colors={ORDER_STATUS_COLORS} />
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
              </div>
            </button>

            {expanded === order.id && (
              <div className="border-t border-border p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted uppercase mb-2">Items</p>
                  <div className="space-y-1.5">
                    {(order.items ?? []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.quantity} × {item.name}</span>
                        <span className="text-muted font-mono">{formatCurrency(Number(item.price) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-border mt-3 pt-3 text-sm font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground font-mono">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-xs font-medium text-muted uppercase mb-1">Notes</p>
                    <p className="text-sm text-foreground">{order.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted">Status:</span>
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => startTransition(() => run(() => updateOrderStatus(order.id, status), "Status updated"))}
                        disabled={isPending}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors border ${
                          order.status === status
                            ? "bg-brand text-white border-brand"
                            : "border-border text-muted hover:border-brand/40 hover:text-foreground"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => run(() => deleteOrder(order.id), "Order deleted")}
                    className="text-red-500 hover:text-red-600 border-red-200 dark:border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
