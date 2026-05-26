import { IndianRupee, ShoppingBag, TrendingUp, Users } from "lucide-react";

const icons = [IndianRupee, ShoppingBag, Users, TrendingUp];

export function StatGrid({ stats }: { stats: Array<{ label: string; value: string }> }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] ?? TrendingUp;
        return (
          <div key={stat.label} className="metric-card">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-ink)]">
              <Icon size={18} aria-hidden />
            </div>
            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        );
      })}
    </section>
  );
}
