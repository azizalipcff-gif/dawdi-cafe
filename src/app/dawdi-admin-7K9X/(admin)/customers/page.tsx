"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const { customers, orders } = useAdminStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status !== "cancelled");
    const spent = completed.reduce((sum, o) => sum + Number(o.total), 0);
    return {
      total: customers.length,
      orders: orders.length,
      spent,
    };
  }, [customers, orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Customers
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Derived from orders and registered profiles
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Customers</p>
            <p className="font-display text-lg font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Orders</p>
            <p className="font-display text-lg font-bold text-white">{stats.orders}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Spent</p>
            <p className="font-display text-lg font-bold text-white">
              {formatCurrency(stats.spent)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              )}
              {filtered.map((customer) => {
                const customerOrders = orders.filter(
                  (o) => o.customer_phone.replace(/\D/g, "") === customer.phone.replace(/\D/g, "")
                );
                const spent = customerOrders
                  .filter((o) => o.status !== "cancelled")
                  .reduce((sum, o) => sum + Number(o.total), 0);

                return (
                  <tr key={customer.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-100">{customer.name}</p>
                          <p className="text-xs text-zinc-500">
                            Since {formatDate(customer.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{customer.phone}</td>
                    <td className="px-4 py-3 text-zinc-300">{customer.email || "—"}</td>
                    <td className="px-4 py-3 text-zinc-300">{customerOrders.length}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatCurrency(spent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
