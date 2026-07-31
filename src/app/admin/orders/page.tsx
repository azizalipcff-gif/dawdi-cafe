"use client";

import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "#1024", customer: "Sara B.", items: "Cappuccino, Nutella Crêpe", total: "65 MAD", status: "Completed" as const, date: "2024-01-15" },
  { id: "#1023", customer: "Ahmed M.", items: "Latte, Croissant", total: "40 MAD", status: "Completed" as const, date: "2024-01-15" },
  { id: "#1022", customer: "Leila K.", items: "Mint Tea, Baklava", total: "35 MAD", status: "Pending" as const, date: "2024-01-14" },
  { id: "#1021", customer: "Youssef R.", items: "Espresso, Cheesecake", total: "50 MAD", status: "Processing" as const, date: "2024-01-14" },
  { id: "#1020", customer: "Fatima Z.", items: "Iced Latte, Fruit Crêpe", total: "55 MAD", status: "Completed" as const, date: "2024-01-13" },
  { id: "#1019", customer: "Omar H.", items: "Oreo Crêpe", total: "40 MAD", status: "Cancelled" as const, date: "2024-01-13" },
];

export default function AdminOrdersPage() {
  return (
    <AdminPageShell title="Orders" subtitle="Manage customer orders" icon={<ShoppingBag className="w-5 h-5" />}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left p-4 font-medium text-muted">Order</th>
                <th className="text-left p-4 font-medium text-muted">Customer</th>
                <th className="text-left p-4 font-medium text-muted">Items</th>
                <th className="text-left p-4 font-medium text-muted">Total</th>
                <th className="text-left p-4 font-medium text-muted">Date</th>
                <th className="text-left p-4 font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{order.id}</td>
                  <td className="p-4 text-foreground">{order.customer}</td>
                  <td className="p-4 text-muted">{order.items}</td>
                  <td className="p-4 text-foreground font-mono">{order.total}</td>
                  <td className="p-4 text-muted">{order.date}</td>
                  <td className="p-4">
                    <Badge variant={order.status === "Completed" ? "success" : order.status === "Cancelled" ? "destructive" : "outline"}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageShell>
  );
}

function AdminPageShell({ children, title, subtitle, icon }: { children: React.ReactNode; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">{icon}</div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
