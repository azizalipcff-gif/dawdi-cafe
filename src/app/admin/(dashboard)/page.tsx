import Link from "next/link";
import {
  DollarSign, ShoppingCart, CalendarCheck, MessageSquare,
  Package, FolderTree, Images, Star, ChevronRight,
} from "lucide-react";
import { getDashboardStats, getLatestOrders, getLatestReservations, getMessages } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [stats, orders, reservations, messages] = await Promise.all([
    getDashboardStats(),
    getLatestOrders(5),
    getLatestReservations(4),
    getMessages(),
  ]);

  const unreadMessages = messages.filter((m) => !m.is_read);

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.revenue),
      sub: `${stats.totalOrders} orders`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      label: "Orders Today",
      value: String(stats.todayOrders),
      sub: `${stats.totalOrders} total`,
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "bg-brand/10 text-brand",
    },
    {
      label: "Reservations Today",
      value: String(stats.todayReservations),
      sub: "requests",
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Unread Messages",
      value: String(stats.unreadMessages),
      sub: "inbox",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Products",
      value: String(stats.totalProducts),
      sub: "menu items",
      icon: <Package className="w-5 h-5" />,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Categories",
      value: String(stats.totalCategories),
      sub: "sections",
      icon: <FolderTree className="w-5 h-5" />,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      label: "Gallery Photos",
      value: String(stats.totalGallery),
      sub: "images",
      icon: <Images className="w-5 h-5" />,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      label: "Testimonials",
      value: String(stats.totalTestimonials),
      sub: "reviews",
      icon: <Star className="w-5 h-5" />,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted mt-1">
              {card.label} · <span className="text-foreground">{card.sub}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-foreground">Recent Orders</h3>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-brand hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {orders.length === 0 && (
              <p className="text-sm text-muted text-center py-8">No orders yet.</p>
            )}
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{order.customer_name}</p>
                  <p className="text-xs text-muted">
                    {order.items.length} items · {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</p>
                  <Badge variant={order.status === "completed" ? "success" : order.status === "cancelled" ? "destructive" : "outline"} className="mt-1 capitalize">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-foreground">Recent Reservations</h3>
              <Link href="/admin/reservations" className="flex items-center gap-1 text-xs text-brand hover:underline">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {reservations.length === 0 && (
                <p className="text-sm text-muted text-center py-6">No reservations yet.</p>
              )}
              {reservations.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{res.name}</p>
                    <p className="text-xs text-muted">
                      {res.guests} guests · {formatDate(res.date)} · {res.time}
                    </p>
                  </div>
                  <Badge variant={res.status === "accepted" ? "success" : res.status === "rejected" || res.status === "cancelled" ? "destructive" : "outline"} className="capitalize shrink-0 ml-3">
                    {res.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-dark border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-foreground">Unread Messages</h3>
              <Link href="/admin/messages" className="flex items-center gap-1 text-xs text-brand hover:underline">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {unreadMessages.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">All caught up!</p>
            ) : (
              <div className="space-y-3">
                {unreadMessages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-foreground">{msg.name}</p>
                    <p className="text-xs text-muted line-clamp-1">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-dark border border-border hover:border-brand/30 transition-colors group"
        >
          <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground group-hover:text-brand transition-colors">Manage Products</p>
            <p className="text-xs text-muted">Add, edit and toggle menu items</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-brand" />
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-dark border border-border hover:border-brand/30 transition-colors group"
        >
          <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground group-hover:text-brand transition-colors">Manage Categories</p>
            <p className="text-xs text-muted">Organize your menu sections</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-brand" />
        </Link>
      </div>
    </div>
  );
}
