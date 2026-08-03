"use client";

import Link from "next/link";
import {
  Package,
  Tags,
  ShoppingCart,
  Images,
  MessageSquare,
  CalendarClock,
  Coffee,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  preparing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ready: "bg-brand/15 text-brand border-brand/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

interface ActivityItem {
  id: string;
  kind: "order" | "reservation" | "message";
  title: string;
  detail: string;
  when: string;
}

export default function DashboardPage() {
  const { products, categories, orders, gallery, reservations, messages, customers } =
    useAdminStore();

  const available = products.filter((p) => p.is_available).length;
  const unavailable = products.length - available;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const recentOrders = [...orders].slice(0, 6);

  const activity: ActivityItem[] = [
    ...orders.map<ActivityItem>((o) => ({
      id: `o-${o.id}`,
      kind: "order",
      title: o.customer_name,
      detail: `${o.items.reduce((n, i) => n + i.quantity, 0)} item(s) · ${formatCurrency(Number(o.total))}`,
      when: o.created_at,
    })),
    ...reservations.map<ActivityItem>((r) => ({
      id: `r-${r.id}`,
      kind: "reservation",
      title: `${r.name} · ${r.guests} guest(s)`,
      detail: `${r.date} at ${r.time}`,
      when: r.created_at,
    })),
    ...messages.map<ActivityItem>((m) => ({
      id: `m-${m.id}`,
      kind: "message",
      title: m.name,
      detail: m.subject || m.message.slice(0, 60),
      when: m.created_at,
    })),
  ]
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 8);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      sub: `${available} available · ${unavailable} unavailable`,
      icon: Package,
      href: "/dawdi-admin-7K9X/products",
    },
    {
      label: "Categories",
      value: categories.length,
      sub: `${categories.filter((c) => c.is_active).length} active`,
      icon: Tags,
      href: "/dawdi-admin-7K9X/categories",
    },
    {
      label: "Total Orders",
      value: orders.length,
      sub: `${pendingOrders} pending`,
      icon: ShoppingCart,
      href: "/dawdi-admin-7K9X/orders",
    },
    {
      label: "Gallery Images",
      value: gallery.length,
      sub: `${gallery.filter((g) => g.is_active).length} visible`,
      icon: Images,
      href: "/dawdi-admin-7K9X/gallery",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Overview of your cafe&apos;s data.
          </p>
        </div>
        <Link
          href="/dawdi-admin-7K9X/products"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
        >
          <Coffee className="h-4 w-4" />
          Manage Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-brand/15 p-2.5 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-brand" />
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-zinc-300">{stat.label}</p>
              <p className="text-xs text-zinc-500">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Availability */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm font-medium text-zinc-400">Product Availability</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Available
              </span>
              <span className="font-display text-xl font-bold text-green-400">{available}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <XCircle className="h-4 w-4 text-red-400" />
                Unavailable
              </span>
              <span className="font-display text-xl font-bold text-red-400">{unavailable}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                style={{
                  width: products.length ? `${(available / products.length) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm font-medium text-zinc-400">Total Revenue</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {formatCurrency(revenue)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Excludes cancelled orders</p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm font-medium text-zinc-400">Customers</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{customers.length}</p>
            <Link href="/dawdi-admin-7K9X/customers" className="text-xs text-brand hover:text-brand-light">
              View customers →
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/dawdi-admin-7K9X/orders" className="text-sm text-brand hover:text-brand-light">
              View all →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 && (
              <p className="text-sm text-zinc-500">No orders yet.</p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDateTime(order.created_at)} ·{" "}
                    {order.items.reduce((n, i) => n + i.quantity, 0)} items
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(Number(order.total))}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                      STATUS_COLORS[order.status] ?? "bg-white/10 text-zinc-300"
                    )}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-lg font-semibold text-white">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {activity.length === 0 && (
              <p className="text-sm text-zinc-500">No recent activity.</p>
            )}
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.kind === "order" && "bg-brand/15 text-brand",
                    item.kind === "reservation" && "bg-blue-500/15 text-blue-400",
                    item.kind === "message" && "bg-green-500/15 text-green-400"
                  )}
                >
                  {item.kind === "order" && <ShoppingCart className="h-4 w-4" />}
                  {item.kind === "reservation" && <CalendarClock className="h-4 w-4" />}
                  {item.kind === "message" && <MessageSquare className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">{item.title}</p>
                  <p className="truncate text-xs text-zinc-500">{item.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] text-zinc-500">
                  {formatDateTime(item.when)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
