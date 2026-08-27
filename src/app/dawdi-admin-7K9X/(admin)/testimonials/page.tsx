"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Search, Trash2, Eye, Check, EyeOff } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Testimonial } from "@/lib/types";
import {
  updateTestimonialActive,
  deleteTestimonial,
} from "@/lib/admin/actions/testimonials";
import { formatDate, cn } from "@/lib/utils";
import { Modal } from "@/components/admin/Modal";

type ActiveFilter = "all" | "active" | "hidden";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i < rating ? "fill-current" : "text-zinc-600")}
        />
      ))}
    </span>
  );
}

export default function TestimonialsPage() {
  const { testimonials } = useAdminStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return testimonials
      .filter((t) =>
        activeFilter === "all"
          ? true
          : activeFilter === "active"
            ? t.is_active
            : !t.is_active
      )
      .filter((t) =>
        !q
          ? true
          : t.name.toLowerCase().includes(q) ||
            (t.role ?? "").toLowerCase().includes(q) ||
            t.content.toLowerCase().includes(q)
      )
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [testimonials, query, activeFilter]);

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

  const handleToggle = (t: Testimonial) => {
    void runMutation(updateTestimonialActive(t.id, !t.is_active), t.id);
  };

  const handleDelete = (t: Testimonial) => {
    if (window.confirm(`Delete testimonial from ${t.name}?`)) {
      void runMutation(deleteTestimonial(t.id), t.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
            <Star className="h-6 w-6 text-brand" /> Testimonials
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {testimonials.length} total · {testimonials.filter((t) => t.is_active).length}{" "}
            published
          </p>
        </div>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or content..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "active", "hidden"] as ActiveFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              activeFilter === f
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
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-zinc-500">
                    No testimonials found.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Stars rating={t.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        t.is_active
                          ? "border-green-500/30 bg-green-500/15 text-green-400"
                          : "border-white/10 text-zinc-400"
                      )}
                    >
                      {t.is_active ? "published" : "hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(t)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                        aria-label="View testimonial"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(t)}
                        disabled={pending === t.id}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand disabled:opacity-50"
                        aria-label={t.is_active ? "Hide testimonial" : "Publish testimonial"}
                      >
                        {t.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        disabled={pending === t.id}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                        aria-label="Delete testimonial"
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
        title="Testimonial details"
      >
        {selected && (
          <div className="space-y-4">
            <DetailRow label="Author" value={selected.name} />
            <DetailRow label="Role" value={selected.role || "—"} />
            <DetailRow label="Rating" value={`${selected.rating} / 5`} />
            <DetailRow label="Status" value={selected.is_active ? "published" : "hidden"} />
            <DetailRow label="Created" value={formatDate(selected.created_at)} />
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Content</p>
              <p className="whitespace-pre-wrap text-zinc-200">{selected.content}</p>
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-right font-medium capitalize text-zinc-100">{value}</span>
    </div>
  );
}
