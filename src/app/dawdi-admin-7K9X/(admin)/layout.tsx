import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/admin/queries";
import { AdminStoreProvider } from "@/lib/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const initialData = await getAdminData();

  return (
    <AdminStoreProvider initialData={initialData}>
      <AdminShell>{children}</AdminShell>
    </AdminStoreProvider>
  );
}
