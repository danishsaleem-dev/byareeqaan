import Link from "next/link";
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Boxes,
} from "lucide-react";
import { getBusinessStats } from "@/lib/stats";
import { RevenueChart } from "@/components/admin/StatsCharts";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  if (n >= 1_000_000) return `Rs ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rs ${Math.round(n / 1_000)}k`;
  return `Rs ${Math.round(n).toLocaleString()}`;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent ?? "bg-violet/10 text-violet-deep"}`}
        >
          {icon}
        </span>
      </div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-plum/50">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function StatsPage() {
  const stats = await getBusinessStats();
  const { revenue, profit, orderCounts, topProducts, customers, stock, portfolioByCollection } =
    stats;

  const lowStock = stock
    .filter((p) => p.stock != null && p.stock <= 3 && p.status === "published")
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">
          Business statistics
        </h1>
        <p className="mt-1 text-sm text-muted">
          Revenue, profit, stock and customer insights.
        </p>
      </div>

      {/* ── Top KPIs ── */}
      <Section title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total revenue"
            value={fmt(revenue.total)}
            sub={`${fmt(revenue.thisMonth)} this month`}
            icon={<TrendingUp size={18} />}
            accent="bg-violet/10 text-violet-deep"
          />
          <StatCard
            label="Total profit"
            value={fmt(profit.total)}
            sub={`${fmt(profit.thisMonth)} this month`}
            icon={<DollarSign size={18} />}
            accent="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Cost spend"
            value={fmt(stats.totalCostSpend)}
            sub="cost of goods sold"
            icon={<ShoppingBag size={18} />}
            accent="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Stock portfolio"
            value={fmt(stats.totalStockValue)}
            sub={`${stats.lowStockCount} low-stock alert${stats.lowStockCount !== 1 ? "s" : ""}`}
            icon={<Boxes size={18} />}
            accent="bg-rose-50 text-rose-500"
          />
        </div>
      </Section>

      {/* ── Revenue chart ── */}
      <Section title="Revenue over time">
        <RevenueChart
          byMonth={stats.revenueByMonth}
          byWeek={stats.revenueByWeek}
        />
      </Section>

      {/* ── Orders + weekly KPIs ── */}
      <Section title="Orders breakdown">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total", value: orderCounts.total, color: "text-ink" },
            { label: "Pending", value: orderCounts.pendingPayment, color: "text-amber-600" },
            { label: "Review", value: orderCounts.paymentReview, color: "text-blue-600" },
            { label: "Confirmed", value: orderCounts.confirmed, color: "text-violet-deep" },
            { label: "Shipped", value: orderCounts.shipped, color: "text-teal-600" },
            { label: "Delivered", value: orderCounts.delivered, color: "text-emerald-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-plum/10 bg-white p-4 text-center"
            >
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Top products + customers ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Top products by revenue">
          <div className="rounded-2xl border border-plum/10 bg-white">
            {topProducts.length === 0 ? (
              <p className="p-5 text-sm text-muted">No sales data yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-plum/10 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-muted">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Sold</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr
                      key={p.productId}
                      className="border-b border-plum/5 last:border-0 hover:bg-cream/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-xs font-bold text-violet-deep">
                            {i + 1}
                          </span>
                          <span className="truncate font-medium text-ink max-w-[140px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted">
                        {p.qtySold}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-violet-deep">
                        {fmt(p.revenue)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={
                            p.profit >= 0 ? "text-emerald-600" : "text-rose-500"
                          }
                        >
                          {p.profit >= 0 ? "+" : ""}
                          {fmt(p.profit)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Section>

        <Section title="Top customers">
          <div className="rounded-2xl border border-plum/10 bg-white">
            {customers.length === 0 ? (
              <p className="p-5 text-sm text-muted">No customers yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-plum/10 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-muted">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Orders</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr
                      key={c.email}
                      className="border-b border-plum/5 last:border-0 hover:bg-cream/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet/10 text-xs font-bold text-violet-deep">
                            {c.email[0].toUpperCase()}
                          </span>
                          <span className="truncate text-ink max-w-[140px] text-xs">
                            {c.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-muted">
                        {c.orderCount}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-ink">
                        {fmt(c.totalSpent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Section>
      </div>

      {/* ── Stock management ── */}
      <Section title="Stock management">
        {lowStock.length > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            <AlertTriangle size={16} />
            {lowStock.length} product{lowStock.length !== 1 ? "s" : ""} running
            low — restock needed
          </div>
        )}
        <div className="rounded-2xl border border-plum/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-plum/10 text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">Stock value</th>
              </tr>
            </thead>
            <tbody>
              {stock
                .filter((p) => p.status !== "archived")
                .sort((a, b) => (a.stock ?? 999) - (b.stock ?? 999))
                .map((p) => {
                  const isLow =
                    p.stock != null && p.stock <= 3 && p.status === "published";
                  const isMto = p.stock == null;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-plum/5 last:border-0 hover:bg-cream/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-medium text-ink hover:text-violet-deep"
                        >
                          {p.name}
                        </Link>
                        {p.status === "draft" && (
                          <span className="ml-2 rounded-full bg-plum/10 px-1.5 py-0.5 text-[10px] text-plum">
                            draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isMto ? (
                          <span className="text-muted">MTO</span>
                        ) : (
                          <span
                            className={
                              isLow
                                ? "font-semibold text-rose-500"
                                : "text-ink"
                            }
                          >
                            {isLow && "⚠ "}
                            {p.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-muted">
                        {fmt(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted">
                        {p.cost != null ? fmt(p.cost) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-ink">
                        {p.portfolioValue != null ? fmt(p.portfolioValue) : "—"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="border-t border-plum/10 bg-cream/30">
                <td colSpan={4} className="px-4 py-3 text-xs font-semibold text-muted">
                  Total portfolio value
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-violet-deep">
                  {fmt(stats.totalStockValue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      {/* ── Portfolio by collection ── */}
      {portfolioByCollection.length > 0 && (
        <Section title="Portfolio by collection">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioByCollection.map((c) => {
              const pct =
                stats.totalStockValue > 0
                  ? Math.round((c.totalStockValue / stats.totalStockValue) * 100)
                  : 0;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-plum/10 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">{c.name}</span>
                    <span className="text-xs text-muted">
                      {c.productCount} product{c.productCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-violet-deep">
                    {fmt(c.totalStockValue)}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-plum/10">
                    <div
                      className="h-full rounded-full bg-violet-deep/60"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
