import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-zinc-400">{admin.email}</p>
        <p className="mt-1 text-zinc-500">{admin.role}</p>
      </div>
    </div>
  );
}
