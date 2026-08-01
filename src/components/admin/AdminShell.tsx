"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree,
  Image as ImageIcon, CalendarCheck, MessageSquare, Users,
  Settings, LogOut, Menu as MenuIcon, X, Home, Presentation, FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/types";
import { logoutAdmin } from "@/lib/actions/auth";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: AdminRole[];
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
  { label: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree className="w-5 h-5" /> },
  { label: "Hero Slides", href: "/admin/hero-slides", icon: <Presentation className="w-5 h-5" /> },
  { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon className="w-5 h-5" /> },
  { label: "Albums", href: "/admin/albums", icon: <FolderOpen className="w-5 h-5" /> },
  { label: "Reservations", href: "/admin/reservations", icon: <CalendarCheck className="w-5 h-5" /> },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" />, roles: ["super_admin"] },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" />, roles: ["super_admin"] },
];

interface AdminShellProps {
  adminRole: AdminRole;
  adminName: string | null;
  children: React.ReactNode;
}

export function AdminShell({ adminRole, adminName, children }: AdminShellProps) {
  const pathname = usePathname();
  const visibleItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(adminRole)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex">
      <AdminSidebar
        items={visibleItems}
        adminName={adminName}
        pathname={pathname}
        adminRole={adminRole}
      />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark/80 glass border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const btn = document.getElementById("admin-mobile-toggle");
                  btn?.click();
                }}
                className="lg:hidden p-2 text-muted hover:text-foreground"
                aria-label="Open menu"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted hidden sm:block">
                <span className="text-foreground font-medium">{adminName ?? "Admin"}</span>
                <span className="ml-2 capitalize text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                  {adminRole.replace("_", " ")}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebar({
  items,
  adminName,
  pathname,
  adminRole,
}: {
  items: SidebarItem[];
  adminName: string | null;
  pathname: string;
  adminRole: AdminRole;
}) {
  const toggle = () => {
    document.querySelector("#admin-sidebar")?.classList.toggle("-translate-x-full");
    document.querySelector("#admin-overlay")?.classList.toggle("hidden");
  };

  return (
    <>
      <div
        id="admin-overlay"
        onClick={toggle}
        className="hidden lg:hidden fixed inset-0 z-40 bg-black/50"
      />
      <aside
        id="admin-sidebar"
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark border-r border-border transform -translate-x-full transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo/logo.png" alt="DAWDI CAFE" fill className="object-contain" sizes="32px" />
            </div>
            <span className="font-display font-bold text-foreground text-sm">DAWDI PANEL</span>
          </Link>
          <button
            onClick={toggle}
            className="lg:hidden p-1 text-muted hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border">
          <button id="admin-mobile-toggle" onClick={toggle} className="hidden lg:hidden" />
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-sm">
              {(adminName ?? "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{adminName ?? "Admin"}</p>
              <p className="text-xs text-muted capitalize">{adminRole.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
