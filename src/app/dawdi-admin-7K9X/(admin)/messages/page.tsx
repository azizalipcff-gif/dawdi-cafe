"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquare, Search, Trash2, Eye, Mail, Phone } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Message } from "@/lib/types";
import { updateMessageRead, deleteMessage } from "@/lib/admin/actions/messages";
import { formatDateTime, buildWhatsAppHref, cn } from "@/lib/utils";
import { Modal } from "@/components/admin/Modal";

type ReadFilter = "all" | "unread" | "read";

export default function MessagesPage() {
  const { messages } = useAdminStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages
      .filter((m) =>
        readFilter === "all"
          ? true
          : readFilter === "unread"
            ? !m.is_read
            : m.is_read
      )
      .filter((m) =>
        !q
          ? true
          : m.name.toLowerCase().includes(q) ||
            (m.email ?? "").toLowerCase().includes(q) ||
            (m.subject ?? "").toLowerCase().includes(q) ||
            m.id.toLowerCase().includes(q)
      )
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [messages, query, readFilter]);

  async function runMutation(promise: Promise<{ error?: string }>, id: string) {
    setPending(id);
    const res = await promise;
    setPending(null);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    router.refresh();
  }

  const handleToggleRead = (m: Message) => {
    void runMutation(updateMessageRead(m.id, !m.is_read), m.id);
  };

  const handleDelete = (m: Message) => {
    if (window.confirm(`Delete message from ${m.name}?`)) {
      void runMutation(deleteMessage(m.id), m.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
            <MessageSquare className="h-6 w-6 text-brand" /> Messages
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {messages.length} total · {messages.filter((m) => !m.is_read).length} unread
          </p>
        </div>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or subject..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "unread", "read"] as ReadFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setReadFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              readFilter === f
                ? "border-brand bg-brand text-white"
                : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Read</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                    No messages found.
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className={cn(
                    "transition hover:bg-white/[0.02]",
                    !m.is_read && "bg-brand/[0.04]"
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{m.name}</p>
                    <p className="text-xs text-zinc-500">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{m.subject || "—"}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {formatDateTime(m.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        m.is_read
                          ? "border-white/10 text-zinc-400"
                          : "border-brand/30 bg-brand/15 text-brand"
                      )}
                    >
                      {m.is_read ? "read" : "unread"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(m)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                        aria-label="View message"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleRead(m)}
                        disabled={pending === m.id}
                        className="rounded-lg border border-white/10 px-2.5 py-2 text-[11px] font-semibold text-zinc-400 transition hover:border-brand/40 hover:text-brand disabled:opacity-50"
                      >
                        {m.is_read ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        disabled={pending === m.id}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                        aria-label="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Message details"
      >
        {selected && (
          <div className="space-y-4">
            <DetailRow label="Name" value={selected.name} />
            <DetailRow
              label="Email"
              value={selected.email}
              href={`mailto:${selected.email}`}
            />
            <DetailRow
              label="Phone"
              value={selected.phone || "—"}
              href={selected.phone ? buildWhatsAppHref(selected.phone, "") : undefined}
            />
            <DetailRow label="Subject" value={selected.subject || "—"} />
            <DetailRow label="Received" value={formatDateTime(selected.created_at)} />
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Message</p>
              <p className="whitespace-pre-wrap text-zinc-200">{selected.message}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-300/90">
              This panel does not send replies. Use the customer&apos;s email or WhatsApp
              link above to respond directly.
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    selected.subject ? `Re: ${selected.subject}` : "Re: your message"
                  )}`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-brand/40 hover:text-brand"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply by email
                </a>
              )}
              {selected.phone && (
                <a
                  href={buildWhatsAppHref(selected.phone, "")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-brand/40 hover:text-brand"
                >
                  <Phone className="h-3.5 w-3.5" /> Message on WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-right font-medium text-brand hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-right font-medium text-zinc-100">{value}</span>
      )}
    </div>
  );
}
