"use client";
import Link from "next/link";
import { Package, Tags, ShoppingCart, Plus, ArrowUpRight, Wallet, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const { products, categories, orders } = useAdminStore();
  const published = products.filter(p => p.status === "published" && p.is_available).length;
  const pending = orders.filter(o => o.status === "pending").length;
  const revenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total || 0), 0);
  const stats = [
    { label: "All products", value: products.length, note: published + " available to customers", icon: Package, href: "/momia-admin/products" },
    { label: "Categories", value: categories.length, note: categories.filter(c => c.is_active).length + " active", icon: Tags, href: "/momia-admin/categories" },
    { label: "Orders", value: orders.length, note: pending + " waiting for review", icon: ShoppingCart, href: "/momia-admin/orders" },
    { label: "Order value", value: formatCurrency(revenue), note: "Total excluding cancelled orders", icon: Wallet, href: "/momia-admin/orders" },
  ];
  const recent = [...orders].sort((a,b) => b.created_at.localeCompare(a.created_at)).slice(0,5);
  return <div className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#00D6C9]">MOMIA STOR</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white">Store dashboard</h1><p className="mt-1 text-sm text-zinc-400">Manage your digital products, packages and customer orders.</p></div>
      <Link href="/momia-admin/products" className="inline-flex items-center gap-2 rounded-xl bg-[#168BFF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500"><Plus className="h-4 w-4"/> Add product</Link>
    </div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{stats.map(({label,value,note,icon:Icon,href}) => <Link key={label} href={href} className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#168BFF]/50 hover:bg-white/[0.05] sm:p-5"><div className="flex items-center justify-between"><span className="rounded-xl bg-[#168BFF]/15 p-2.5 text-[#00D6C9]"><Icon className="h-5 w-5"/></span><ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-[#00D6C9]"/></div><p className="mt-4 break-words text-2xl font-black text-white sm:text-3xl">{value}</p><p className="mt-1 text-sm font-semibold text-zinc-200">{label}</p><p className="mt-1 text-xs text-zinc-500">{note}</p></Link>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">Recent orders</h2><p className="text-xs text-zinc-500">Latest customer requests</p></div><Link href="/momia-admin/orders" className="text-sm font-semibold text-[#00D6C9]">View all →</Link></div>
        <div className="mt-4 space-y-3">{recent.length === 0 ? <div className="rounded-xl border border-dashed border-white/10 p-8 text-center"><ShoppingCart className="mx-auto h-8 w-8 text-zinc-600"/><p className="mt-2 text-sm text-zinc-400">No orders yet</p><p className="text-xs text-zinc-600">Orders will appear here when customers contact you.</p></div> : recent.map(o => <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{o.customer_name}</p><p className="text-xs text-zinc-500">{formatDateTime(o.created_at)} · {o.items.reduce((n,i)=>n+i.quantity,0)} items</p></div><div className="flex items-center gap-2"><span className="text-sm font-bold text-white">{formatCurrency(Number(o.total))}</span><span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">{o.status}</span></div></div>)}</div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#168BFF]/10 to-[#00D6C9]/5 p-5 sm:p-6"><span className="inline-flex rounded-xl bg-[#00D6C9]/10 p-3 text-[#00D6C9]"><CheckCircle2 className="h-6 w-6"/></span><h2 className="mt-4 text-xl font-black text-white">Ready to sell?</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Add a product, set its price and availability, then publish it. Customers can send their order directly to your WhatsApp.</p><div className="mt-5 grid gap-2"><Link href="/momia-admin/products" className="rounded-xl bg-[#168BFF] px-4 py-3 text-center text-sm font-bold text-white">Manage products</Link><Link href="/momia-admin/settings" className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-200 hover:bg-white/5">WhatsApp & store settings</Link></div></section>
    </div>
  </div>;
}
