"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Trash2, X, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Admin, AdminRole } from "@/lib/types";
import { createAdminUser, updateAdminRole, toggleAdminSuspended, deleteAdminUser } from "@/lib/actions/users";
import { formatDate } from "@/lib/utils";

const ROLES: AdminRole[] = ["super_admin", "manager", "employee"];

export function UsersManager({ admins, currentUserId }: { admins: Admin[]; currentUserId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending] = useTransition();

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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">{admins.length} admins</p>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Admin
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left p-4 font-medium text-muted">User</th>
                <th className="text-left p-4 font-medium text-muted">Role</th>
                <th className="text-left p-4 font-medium text-muted">Status</th>
                <th className="text-left p-4 font-medium text-muted">Since</th>
                <th className="text-right p-4 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">No admin users.</td>
                </tr>
              )}
              {admins.map((admin) => {
                const isSelf = admin.user_id === currentUserId;
                const suspended = Boolean(admin.is_suspended);
                return (
                  <tr key={admin.user_id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-sm shrink-0">
                          {(admin.full_name ?? admin.email ?? "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{admin.full_name ?? "Unnamed"}</p>
                          <p className="text-xs text-muted truncate">{admin.email ?? "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={admin.role}
                        disabled={isSelf}
                        onChange={(e) => run(() => updateAdminRole(admin.user_id, e.target.value), "Role updated")}
                        className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="capitalize">{r.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      {suspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </td>
                    <td className="p-4 text-muted">{formatDate(admin.created_at)}</td>
                    <td className="p-4 text-right">
                      {isSelf ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <ShieldCheck className="w-4 h-4" /> You
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => run(() => toggleAdminSuspended(admin.user_id, !suspended), suspended ? "Admin reactivated" : "Admin suspended")}
                            className="p-2 rounded-lg text-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                            aria-label={suspended ? "Reactivate admin" : "Suspend admin"}
                          >
                            {suspended ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => run(() => deleteAdminUser(admin.user_id), "Admin removed")}
                            className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            aria-label="Remove admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <form
            action={async (formData) => {
              const res = await createAdminUser(formData);
              if (res?.error) toast.error(res.error);
              else {
                toast.success("Admin added");
                setOpen(false);
                router.refresh();
              }
            }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-dark border border-border p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Add Admin User</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
              <Input type="email" name="email" placeholder="staff@dawdicafe.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password *</label>
              <Input type="password" name="password" placeholder="Min 8 characters" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
              <select
                name="role"
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="capitalize">{r.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                <Users className="w-4 h-4" />
                Add Admin
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
