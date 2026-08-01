"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search, Trash2, Users, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Reservation, ReservationStatus } from "@/lib/types";
import { updateReservationStatus, deleteReservation } from "@/lib/actions/reservations";
import { formatDate } from "@/lib/utils";
import { RESERVATION_STATUS_COLORS, StatusPill } from "@/components/admin/status";

const STATUSES: ReservationStatus[] = ["pending", "accepted", "rejected", "completed", "cancelled"];

export function ReservationsManager({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ReservationStatus>("all");
  const [isPending, startTransition] = useTransition();

  const filtered = reservations.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const run = async (fn: () => Promise<{ error?: string; success?: boolean }>, msg: string) => {
    const res = await fn();
    if (res?.error) toast.error(res.error);
    else {
      toast.success(msg);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors border ${
                filter === s
                  ? "bg-brand text-white border-brand"
                  : "border-border text-muted hover:border-brand/40 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-sm text-muted text-center py-12 bg-card border border-border rounded-xl">
            No reservations found.
          </div>
        )}
        {filtered.map((res) => (
          <div key={res.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{res.name}</p>
                  <p className="text-xs text-muted">Requested {formatDate(res.created_at)}</p>
                </div>
              </div>
              <StatusPill status={res.status} colors={RESERVATION_STATUS_COLORS} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {res.guests} guests
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5" />
                {formatDate(res.date)} · {res.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {res.phone}
              </span>
            </div>

            {res.notes && <p className="text-sm text-foreground bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">{res.notes}</p>}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => startTransition(() => run(() => updateReservationStatus(res.id, status), "Status updated"))}
                    disabled={isPending}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors border ${
                      res.status === status
                        ? "bg-brand text-white border-brand"
                        : "border-border text-muted hover:border-brand/40 hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => run(() => deleteReservation(res.id), "Reservation deleted")}
                className="text-red-500 hover:text-red-600 border-red-200 dark:border-red-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
