import type { AnalyticsSummary } from "@telugu-yuvatha/shared";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Shell } from "@/components/Shell";
import { StatGrid } from "@/components/StatGrid";
import { api } from "@/lib/api";

async function getAnalytics() {
  try {
    return await api.get<AnalyticsSummary>("/admin/analytics");
  } catch {
    return { revenue: 0, orders: 0, customers: 0, bestSellingProducts: [], lowStockProducts: [] };
  }
}

export default async function DashboardPage() {
  const analytics = await getAnalytics();
  return (
    <Shell>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Operations overview</h1>
      </div>
      <StatGrid
        stats={[
          { label: "Revenue", value: `₹${analytics.revenue.toLocaleString("en-IN")}` },
          { label: "Orders", value: String(analytics.orders) },
          { label: "Customers", value: String(analytics.customers) },
          { label: "Low stock", value: String(analytics.lowStockProducts.length) }
        ]}
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Best-selling products</h2>
          <AnalyticsChart rows={analytics.bestSellingProducts} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Low stock alerts</h2>
          <div className="surface divide-y divide-[var(--border)]">
            {analytics.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between px-4 py-3">
                <span>{product.name}</span>
                <span className="rounded bg-[var(--panel-strong)] px-2 py-1 text-sm">{product.stock}</span>
              </div>
            ))}
            {!analytics.lowStockProducts.length && <p className="px-4 py-6 text-sm text-[var(--muted)]">No low stock products.</p>}
          </div>
        </section>
      </div>
    </Shell>
  );
}
