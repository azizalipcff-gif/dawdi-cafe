"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarClock, Search, Trash2, Eye } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Reservation, ReservationStatus } from "@/lib/types";
import {
  updateReservationStatus,
  deleteReservation,
} from "@/lib/admin/actions/reservations";
import { formatDate, formatDateTime, formatTime, buildWhatsAppHref, cn } from "@/lib/utils";
import { Modal } from "@/components/admin/Modal";

const STATUSES: ReservationStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
];

const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  accepted: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  completed: "bg-brand/15 text-brand border-brand/30",
  cancelled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const FILTERS: ("all" | ReservationStatus)[] = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
];

export default function ReservationsPage() {
  const { reservations } = useAdminStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReservationStatus>("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .filter((r) =>
        !q
          ? true
          : r.name.toLowerCase().includes(q) ||
            r.phone.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q)
      )
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [reservations, query, statusFilter]);

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

  const handleStatus = (r: Reservation, status: ReservationStatus) => {
    void runMutation(updateReservationStatus(r.id, status), r.id);
  };

  const handleDelete = (r: Reservation) => {
    if (window.confirm(`Delete reservation from ${r.name} on ${r.date}?`)) {
      void runMutation(deleteReservation(r.id), r.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
            <CalendarClock className="h-6 w-6 text-brand" /> Reservations
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {reservations.length} total · {reservations.filter((r) => r.status === "pending").length}{" "}
            pending
          </p>
        </div>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone or ID..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              statusFilter === f
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
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                    No reservations found.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-200">{formatDate(r.date)}</p>
                    <p className="text-xs text-zinc-500">{formatTime(r.time)}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{r.guests}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      disabled={pending === r.id}
                      onChange={(e) =>
                        handleStatus(r, e.target.value as ReservationStatus)
                      }
                      className={cn(
                        "cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize outline-none disabled:opacity-50",
                        STATUS_COLORS[r.status]
                      )}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-zinc-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(r)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                        aria-label="View reservation"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        disabled={pending === r.id}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                        aria-label="Delete reservation"
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
        title="Reservation details"
      >
        {selected && (
          <div className="space-y-4">
            <DetailRow label="Customer" value={selected.name} />
            <DetailRow label="Phone" value={selected.phone} />
            <DetailRow
              label="WhatsApp"
              value={selected.phone}
              href={buildWhatsAppHref(selected.phone, `Hello ${selected.name}`)}
            />
            <DetailRow label="Date" value={formatDate(selected.date)} />
            <DetailRow label="Time" value={formatTime(selected.time)} />
            <DetailRow label="Party size" value={`${selected.guests} guests`} />
            <DetailRow label="Status" value={selected.status} />
            <DetailRow label="Received" value={formatDateTime(selected.created_at)} />
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Notes</p>
              <p className="whitespace-pre-wrap text-zinc-200">
                {selected.notes || "—"}
              </p>
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
        <span className="text-right font-medium capitalize text-zinc-100">{value}</span>
      )}
    </div>
  );
}
