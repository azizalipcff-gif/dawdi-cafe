import { Users } from "lucide-react";
import { requireRole, listAdminUsers } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsersManager } from "./UsersManager";

export default async function AdminUsersPage() {
  const current = await requireRole(["super_admin"]);
  const admins = await listAdminUsers();

  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailByUserId = new Map(
    (authUsers?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  const enriched = admins.map((a) => ({
    ...a,
    email: emailByUserId.get(a.user_id) ?? undefined,
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Admin Users</h1>
          <p className="text-sm text-muted">Manage staff access and roles</p>
        </div>
      </div>
      <UsersManager admins={enriched} currentUserId={current.user_id} />
    </div>
  );
}
