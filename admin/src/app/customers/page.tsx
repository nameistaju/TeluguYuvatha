import type { User } from "@telugu-yuvatha/shared";
import { DataTable } from "@/components/DataTable";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default async function CustomersPage() {
  const rows = await api.get<User[]>("/admin/customers").catch(() => []);
  return (
    <Shell>
      <h1 className="mb-1 text-3xl font-semibold">Customers</h1>
      <p className="mb-5 text-sm text-[var(--muted)]">Customer accounts and address coverage.</p>
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "createdAt", label: "Joined", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") }
        ]}
      />
    </Shell>
  );
}
