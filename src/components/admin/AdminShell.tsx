"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Settings, Images, Home, ShoppingBag, LogOut, CalendarClock, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/admin/actions/auth";

const NAV_ITEMS = [
  { href: "/dawdi-admin-7K9X", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dawdi-admin-7K9X/products", label: "Services & Products", icon: Package, exact: false },
  { href: "/dawdi-admin-7K9X/categories", label: "Categories", icon: Tags, exact: false },
  { href: "/dawdi-admin-7K9X/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/dawdi-admin-7K9X/reservations", label: "Requests", icon: CalendarClock, exact: false },
  { href: "/dawdi-admin-7K9X/messages", label: "Messages", icon: MessageSquare, exact: false },
  { href: "/dawdi-admin-7K9X/testimonials", label: "Reviews", icon: Star, exact: false },
  { href: "/dawdi-admin-7K9X/gallery", label: "Media", icon: Images, exact: false },
  { href: "/dawdi-admin-7K9X/homepage", label: "Storefront", icon: Home, exact: false },
  { href: "/dawdi-admin-7K9X/customers", label: "Customers", icon: Users, exact: false },
  { href: "/dawdi-admin-7K9X/settings", label: "Settings", icon: Settings, exact: false },
];
function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof LayoutDashboard; active: boolean }) {
  return <Link href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",active?"bg-[#168BFF] text-white shadow-lg shadow-blue-500/20":"text-zinc-400 hover:bg-white/5 hover:text-white")}><Icon className="h-4.5 w-4.5 shrink-0"/>{label}</Link>;
}
function SignOutButton({ compact=false }: { compact?: boolean }) {
  return <form action={signOut}><button type="submit" aria-label="Sign out" className={cn("flex items-center gap-3 rounded-xl text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400",compact?"h-9 w-9 items-center justify-center border border-white/10 px-0 py-0":"w-full px-3 py-2.5")}><LogOut className="h-4.5 w-4.5 shrink-0"/>{!compact&&"Sign out"}</button></form>;
}
export function AdminShell({ children }: { children: React.ReactNode }) {
 const pathname=usePathname();
 return <div className="min-h-screen flex bg-[#0B1424] text-zinc-100">
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#08111f] lg:flex">
   <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag className="h-5 w-5"/></div><div className="leading-tight"><p className="text-sm font-black tracking-wider text-white">MOMIA STOR</p><p className="text-[11px] text-zinc-400">Store Administration</p></div></div>
   <nav className="flex-1 space-y-1 overflow-y-auto p-3">{NAV_ITEMS.map(item=>{const active=item.exact?pathname===item.href:pathname?.startsWith(item.href);return <NavLink key={item.href} {...item} active={active}/>})}</nav>
   <div className="space-y-1 border-t border-white/10 p-3"><SignOutButton/><Link href="/ar" className="block rounded-xl px-3 py-2.5 text-center text-xs text-zinc-500 transition-colors hover:bg-white/5 hover:text-[#00D6C9]">← Back to store</Link></div>
  </aside>
  <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-white/10 bg-[#08111f] px-3 sm:h-16 sm:px-4 lg:hidden"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag className="h-5 w-5"/></div><div className="leading-tight"><p className="text-sm font-black tracking-wider text-white">MOMIA STOR</p><p className="text-[11px] text-zinc-400">Admin</p></div><div className="ml-auto"><SignOutButton compact/></div></div>
  <nav className="fixed inset-x-0 top-14 z-30 flex gap-1.5 overflow-x-auto border-b border-white/10 bg-[#08111f] px-2.5 py-2 sm:top-16 sm:px-3 lg:hidden scrollbar-hide overscroll-x-contain">{NAV_ITEMS.map(item=>{const active=item.exact?pathname===item.href:pathname?.startsWith(item.href);return <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-colors",active?"bg-[#168BFF] text-white":"text-zinc-400 hover:bg-white/5 hover:text-white")}><item.icon className="h-3.5 w-3.5"/>{item.label}</Link>})}</nav>
  <main className="min-w-0 flex-1 lg:pl-64"><div className="mx-auto w-full max-w-6xl min-w-0 px-3 pb-8 pt-24 sm:px-6 lg:py-8 lg:px-8">{children}</div></main>
 </div>;
}
