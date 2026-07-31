"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: 1, name: "Admin DAWDI", email: "admin@dawdicafe.com", role: "Admin" as const },
  { id: 2, name: "Barista Ahmed", email: "ahmed@dawdicafe.com", role: "Editor" as const },
  { id: 3, name: "Manager Sara", email: "sara@dawdicafe.com", role: "Admin" as const },
  { id: 4, name: "Staff Omar", email: "omar@dawdicafe.com", role: "Viewer" as const },
];

export default function AdminUsersPage() {
  return (
    <AdminPageShell title="Users" subtitle="Manage user accounts" icon={<Users className="w-5 h-5" />}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left p-4 font-medium text-muted">Name</th>
              <th className="text-left p-4 font-medium text-muted">Email</th>
              <th className="text-left p-4 font-medium text-muted">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted">{user.email}</td>
                <td className="p-4">
                  <Badge variant={user.role === "Admin" ? "default" : user.role === "Editor" ? "secondary" : "outline"}>{user.role}</Badge>
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
