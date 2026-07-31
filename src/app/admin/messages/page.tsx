"use client";

import { MessageSquare, Mail, Trash2 } from "lucide-react";

const messages = [
  { id: 1, name: "Sara B.", email: "sara@example.com", message: "Do you offer vegan options?", date: "2024-01-15" },
  { id: 2, name: "Ahmed M.", email: "ahmed@example.com", message: "Can I book a table for 6 people on Saturday?", date: "2024-01-14" },
  { id: 3, name: "Leila K.", email: "leila@example.com", message: "What are your opening hours during Ramadan?", date: "2024-01-13" },
];

export default function AdminMessagesPage() {
  return (
    <AdminPageShell title="Messages" subtitle="View customer messages" icon={<MessageSquare className="w-5 h-5" />}>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-5 rounded-xl bg-card border border-border hover:border-brand/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-sm">
                  {msg.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{msg.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Mail className="w-3 h-3" />
                    {msg.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{msg.date}</span>
                <button className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
          </div>
        ))}
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
