"use client";

import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reservations = [
  { id: 1, name: "Ahmed M.", guests: 4, date: "2024-01-20", time: "19:00", status: "Confirmed" as const },
  { id: 2, name: "Sara B.", guests: 2, date: "2024-01-21", time: "12:30", status: "Pending" as const },
  { id: 3, name: "Leila K.", guests: 6, date: "2024-01-22", time: "20:00", status: "Confirmed" as const },
];

export default function AdminReservationsPage() {
  return (
    <AdminPageShell title="Reservations" subtitle="Manage table reservations" icon={<CalendarCheck className="w-5 h-5" />}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left p-4 font-medium text-muted">Customer</th>
              <th className="text-left p-4 font-medium text-muted">Guests</th>
              <th className="text-left p-4 font-medium text-muted">Date</th>
              <th className="text-left p-4 font-medium text-muted">Time</th>
              <th className="text-left p-4 font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4 font-medium text-foreground">{r.name}</td>
                <td className="p-4 text-muted">{r.guests} persons</td>
                <td className="p-4 text-foreground">{r.date}</td>
                <td className="p-4 text-foreground">{r.time}</td>
                <td className="p-4">
                  <Badge variant={r.status === "Confirmed" ? "success" : "outline"}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
