"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { BusinessStatistic } from "@/lib/types";
import { createStatistic, updateStatistic, deleteStatistic } from "@/lib/admin/actions/statistics";
import type { StatisticPatch, StatisticInput } from "@/lib/admin/actions/statistics";
import { useRouter } from "next/navigation";

export default function StatisticsAdminPage() {
  const { statistics } = useAdminStore();
  const [drafts, setDrafts] = useState<Record<string, Partial<BusinessStatistic>>>(() => {
    const map: Record<string, Partial<BusinessStatistic>> = {};
    for (const s of statistics) map[s.id] = { ...s };
    return map;
  });
  const router = useRouter();

  const onChange = (id: string, field: keyof BusinessStatistic, value: unknown) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? {}), [field]: value } }));
  };

  const handleSave = async (id: string) => {
    const patch = drafts[id] as StatisticPatch | undefined;
    if (!patch) return;
    await updateStatistic(id, patch);
    router.refresh();
  };

  const handleCreate = async () => {
    const input: Partial<BusinessStatistic> = {
      key: `stat_${Date.now()}`,
      label: "New Statistic",
      value: "",
      description: "",
      use_real_count: false,
      sort_order: statistics.length + 1,
      is_active: true,
    };
    await createStatistic(input as StatisticInput);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this statistic?")) return;
    await deleteStatistic(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Statistics</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage public business statistics.</p>
        </div>
        <div>
          <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white">
            <Plus className="h-4 w-4" /> Add Statistic
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Use Real Count</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {statistics.map((s) => (
                <tr key={s.id} className="bg-transparent">
                  <td className="px-4 py-3">
                    <input value={drafts[s.id]?.label ?? s.label} onChange={(e) => onChange(s.id, "label", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white" />
                  </td>
                  <td className="px-4 py-3">
                    <input value={drafts[s.id]?.value ?? (s.value ?? "")} onChange={(e) => onChange(s.id, "value", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white" />
                  </td>
                  <td className="px-4 py-3">
                    <input value={drafts[s.id]?.key ?? s.key} onChange={(e) => onChange(s.id, "key", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={Boolean(drafts[s.id]?.use_real_count ?? s.use_real_count)} onChange={(e) => onChange(s.id, "use_real_count", e.target.checked)} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={drafts[s.id]?.sort_order ?? s.sort_order} onChange={(e) => onChange(s.id, "sort_order", Number(e.target.value))} className="w-24 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={Boolean(drafts[s.id]?.is_active ?? s.is_active)} onChange={(e) => onChange(s.id, "is_active", e.target.checked)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleSave(s.id)} className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-medium text-white">
                        <Save className="h-4 w-4" /> Save
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-white">
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
    </div>
  );
}
