"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Mail, Phone, Trash2, Check, MailOpen, Reply, Archive, ArchiveRestore } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Message } from "@/lib/types";
import { toggleMessageRead, toggleMessageReplied, toggleMessageArchived, deleteMessage } from "@/lib/actions/messages";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isPending, startTransition] = useTransition();

  const run = async (fn: () => Promise<{ error?: string; success?: boolean }>, msg: string) => {
    const res = await fn();
    if (res?.error) toast.error(res.error);
    else {
      toast.success(msg);
      router.refresh();
    }
  };

  const visible = messages.filter((m) => (showArchived ? m.is_archived : !m.is_archived));
  const active = visible.find((m) => m.id === selected) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-180px)]">
      <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
        <div className="p-3 border-b border-border flex gap-2">
          <button
            onClick={() => setShowArchived(false)}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              !showArchived ? "bg-brand/10 text-brand" : "text-muted hover:text-foreground"
            )}
          >
            Inbox
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              showArchived ? "bg-brand/10 text-brand" : "text-muted hover:text-foreground"
            )}
          >
            Archived
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {visible.length === 0 && (
            <p className="text-sm text-muted text-center py-10">No messages here.</p>
          )}
          {visible.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              className={cn(
                "w-full text-left p-4 border-b border-border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30",
                selected === msg.id && "bg-brand/5",
                !msg.is_read && "bg-amber-50/60 dark:bg-amber-500/5"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={cn("text-sm truncate", msg.is_read ? "text-muted" : "font-semibold text-foreground")}>
                  {msg.name}
                </p>
                <span className="text-[10px] text-muted shrink-0">{formatDateTime(msg.created_at)}</span>
              </div>
              <p className="text-xs text-muted truncate">{msg.subject || msg.message}</p>
              {(msg.is_replied || msg.is_archived) && (
                <div className="flex gap-1.5 mt-1.5">
                  {msg.is_replied && <Badge variant="success">Replied</Badge>}
                  {msg.is_archived && <Badge variant="outline">Archived</Badge>}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 overflow-y-auto">
        {!active ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-muted">Select a message to view it.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{active.subject || "No subject"}</h3>
                <p className="text-sm text-muted">{formatDateTime(active.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startTransition(() => run(() => toggleMessageReplied(active.id, !active.is_replied), "Updated"))}
                  disabled={isPending}
                  className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                  title={active.is_replied ? "Mark as not replied" : "Mark as replied"}
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startTransition(() => run(() => toggleMessageRead(active.id, !active.is_read), "Updated"))}
                  disabled={isPending}
                  className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                  title={active.is_read ? "Mark as unread" : "Mark as read"}
                >
                  {active.is_read ? <MailOpen className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startTransition(() => run(() => toggleMessageArchived(active.id, !active.is_archived), "Updated"))}
                  disabled={isPending}
                  className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                  title={active.is_archived ? "Unarchive" : "Archive"}
                >
                  {active.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => run(() => deleteMessage(active.id), "Message deleted")}
                  className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted">
              <a href={`mailto:${active.email}`} className="flex items-center gap-1.5 hover:text-brand transition-colors">
                <Mail className="w-4 h-4" /> {active.email}
              </a>
              {active.phone && (
                <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 hover:text-brand transition-colors">
                  <Phone className="w-4 h-4" /> {active.phone}
                </a>
              )}
            </div>

            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{active.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
