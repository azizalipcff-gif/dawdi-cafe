"use client";

import { BarChart3, DollarSign, Users, ShoppingCart, Eye } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$45,230", change: "+22.5%", icon: <DollarSign className="w-5 h-5" />, color: "bg-green-500/10 text-green-600" },
  { label: "Total Orders", value: "1,847", change: "+18.2%", icon: <ShoppingCart className="w-5 h-5" />, color: "bg-brand/10 text-brand" },
  { label: "Total Customers", value: "5,230", change: "+15.3%", icon: <Users className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-600" },
  { label: "Page Views", value: "28,471", change: "+32.1%", icon: <Eye className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-600" },
];

const chartData = [
  { month: "Jan", revenue: 3200, orders: 120 },
  { month: "Feb", revenue: 3800, orders: 145 },
  { month: "Mar", revenue: 4200, orders: 160 },
  { month: "Apr", revenue: 3600, orders: 138 },
  { month: "May", revenue: 5100, orders: 192 },
  { month: "Jun", revenue: 4800, orders: 180 },
];

export default function AdminStatisticsPage() {
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const maxOrders = Math.max(...chartData.map((d) => d.orders));

  return (
    <AdminPageShell title="Statistics" subtitle="Business performance analytics" icon={<BarChart3 className="w-5 h-5" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-display text-base font-semibold text-foreground mb-6">Monthly Revenue</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted font-mono">${d.revenue}</span>
                <div
                  className="w-full rounded-lg bg-brand/20 hover:bg-brand/30 transition-colors"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
                <span className="text-[10px] text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-display text-base font-semibold text-foreground mb-6">Monthly Orders</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted font-mono">{d.orders}</span>
                <div
                  className="w-full rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                  style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                />
                <span className="text-[10px] text-muted">{d.month}</span>
              </div>
            ))}
          </div>
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
