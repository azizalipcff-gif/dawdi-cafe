"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree,
  CalendarCheck, MessageSquare, Users, BarChart3, Settings,
  LogOut, Menu as MenuIcon, X, ChevronRight,
  DollarSign, ShoppingCart, Eye,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
  { label: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree className="w-5 h-5" /> },
  { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon className="w-5 h-5" /> },
  { label: "Reservations", href: "/admin/reservations", icon: <CalendarCheck className="w-5 h-5" /> },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { label: "Statistics", href: "/admin/statistics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

const statsCards = [
  { label: "Total Revenue", value: "$12,450", change: "+12.5%", icon: <DollarSign className="w-5 h-5" />, color: "bg-green-500/10 text-green-600" },
  { label: "Orders Today", value: "48", change: "+8.2%", icon: <ShoppingCart className="w-5 h-5" />, color: "bg-brand/10 text-brand" },
  { label: "Products", value: "52", change: "+3", icon: <Package className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-600" },
  { label: "Page Views", value: "2,847", change: "+18.3%", icon: <Eye className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-600" },
];

const recentOrders = [
  { id: "#1024", customer: "Sara B.", items: "Cappuccino, Nutella Crêpe", total: "65 MAD", status: "Completed" },
  { id: "#1023", customer: "Ahmed M.", items: "Latte, Croissant", total: "40 MAD", status: "Completed" },
  { id: "#1022", customer: "Leila K.", items: "Mint Tea, Baklava", total: "35 MAD", status: "Pending" },
  { id: "#1021", customer: "Youssef R.", items: "Espresso, Cheesecake", total: "50 MAD", status: "Processing" },
  { id: "#1020", customer: "Fatima Z.", items: "Iced Latte, Fruit Crêpe", total: "55 MAD", status: "Completed" },
];

export function AdminDashboard() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 shrink-0">
                <Image src="/logo/logo.png" alt="DAWDI CAFE" fill className="object-contain" sizes="32px" />
              </div>
              <span className="font-display font-bold text-foreground text-sm">DAWDI PANEL</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-brand/10 text-brand"
                  : "text-muted hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark/80 glass border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-muted hover:text-foreground">
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted">
              <LayoutDashboard className="w-4 h-4" />
              <span>/</span>
              <span className="text-foreground font-medium">Dashboard</span>
            </div>
            <Link href="/" className="flex items-center gap-1 text-sm text-brand hover:underline">
              View Site
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-white dark:bg-dark border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", card.color)}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">{card.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{order.total}</p>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        order.status === "Completed" && "bg-green-50 text-green-600 dark:bg-green-500/10",
                        order.status === "Pending" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
                        order.status === "Processing" && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add Product", icon: <Package className="w-4 h-4" /> },
                  { label: "New Category", icon: <FolderTree className="w-4 h-4" /> },
                  { label: "Upload Image", icon: <ImageIcon className="w-4 h-4" /> },
                  { label: "View Messages", icon: <MessageSquare className="w-4 h-4" /> },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-border hover:border-brand/20 transition-all text-muted hover:text-foreground"
                  >
                    {action.icon}
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>

              <h3 className="font-display text-base font-semibold text-foreground mt-6 mb-4">Sales Overview</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-lg bg-brand/20"
                      style={{ height: `${30 + Math.random() * 70}%` }}
                    />
                    <span className="text-[10px] text-muted">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
