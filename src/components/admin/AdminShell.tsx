"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, ShoppingBag, LogOut, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/admin/actions/auth";

const NAV_ITEMS = [
  { href: "/momia-admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/momia-admin/products", label: "Products & Packages", icon: Package, exact: false },
  { href: "/momia-admin/categories", label: "Categories", icon: Tags, exact: false },
  { href: "/momia-admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/momia-admin/settings", label: "Store settings", icon: Settings, exact: false },
];

function SignOutButton({ compact = false }: { compact?: boolean }) {
  return <form action={signOut}><button type="submit" aria-label="Sign out" className={cn("flex items-center gap-3 rounded-xl text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400", compact ? "h-10 w-10 justify-center border border-white/10" : "w-full px-3 py-3")}><LogOut className="h-4 w-4" />{!compact && "Sign out"}</button></form>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="min-h-screen bg-[#0B1424] text-zinc-100">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#08111f] lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag className="h-6 w-6" /></div>
        <div><p className="text-base font-black tracking-wider text-white">MOMIA STOR</p><p className="text-xs text-zinc-500">Store control center</p></div>
      </div>
      <nav className="flex-1 space-y-2 p-4">{NAV_ITEMS.map(item => {
        const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", active ? "bg-[#168BFF] text-white shadow-lg shadow-blue-500/20" : "text-zinc-400 hover:bg-white/5 hover:text-white")}><Icon className="h-5 w-5" />{item.label}</Link>;
      })}</nav>
      <div className="space-y-2 border-t border-white/10 p-4"><SignOutButton /><Link href="/ar" className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-[#00D6C9]"><Store className="h-4 w-4" /> View store</Link></div>
    </aside>
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-white/10 bg-[#08111f]/95 px-4 backdrop-blur lg:hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag className="h-5 w-5" /></div>
      <div><p className="text-sm font-black tracking-wider">MOMIA STOR</p><p className="text-[11px] text-zinc-500">Admin panel</p></div>
      <div className="ml-auto"><SignOutButton compact /></div>
    </header>
    <nav className="fixed inset-x-0 top-16 z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-[#08111f] px-3 py-2.5 lg:hidden">{NAV_ITEMS.map(item => {
      const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
      const Icon = item.icon;
      return <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold", active ? "bg-[#168BFF] text-white" : "text-zinc-400 hover:bg-white/5")}><Icon className="h-4 w-4" />{item.label}</Link>;
    })}</nav>
    <main className="min-w-0 lg:pl-64"><div className="mx-auto w-full max-w-7xl min-w-0 px-3 pb-10 pt-32 sm:px-6 lg:px-8 lg:py-8">{children}</div></main>
  </div>;
}
