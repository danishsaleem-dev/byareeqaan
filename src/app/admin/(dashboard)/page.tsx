import Link from "next/link";
import { Plus, LayoutTemplate, ImageIcon, Package, FolderOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { getStats, listProducts } from "@/lib/data";
import { Card, StatusBadge } from "@/components/admin/ui";

export default async function DashboardPage() {
  const [stats, products] = await Promise.all([getStats(), listProducts()]);
  const recent = products.slice(0, 6);

  const cards = [
    { label: "Total products", value: stats.totalProducts, icon: Package },
    { label: "Published", value: stats.publishedProducts, icon: CheckCircle2 },
    { label: "Collections", value: stats.totalCollections, icon: FolderOpen },
  ];

  const actions = [
    { label: "Add product", href: "/admin/products/new", icon: Plus },
    { label: "Homepage editor", href: "/admin/homepage", icon: LayoutTemplate },
    { label: "Media library", href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back — here&apos;s your store at a glance.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-deep px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet"
        >
          <Plus size={16} /> New product
        </Link>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet-deep">
                <Icon size={22} />
              </span>
              <div>
                <div className="text-3xl font-semibold text-ink">{c.value}</div>
                <div className="text-sm text-muted">{c.label}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <Card className="group flex items-center justify-between transition-colors hover:border-violet/30">
                <span className="flex items-center gap-3 text-sm font-medium text-plum">
                  <Icon size={18} className="text-violet-deep" /> {a.label}
                </span>
                <ArrowRight
                  size={16}
                  className="text-muted transition-transform group-hover:translate-x-0.5"
                />
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent products */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            Recent products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-violet-deep hover:underline"
          >
            View all
          </Link>
        </div>
        <Card className="p-0">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">
              No products yet.{" "}
              <Link href="/admin/products/new" className="text-violet-deep underline">
                Create your first product
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-black/[0.02]"
                  >
                    <Thumb url={p.images.find((i) => i.primary)?.url ?? p.images[0]?.url} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">
                        {p.name}
                      </span>
                      <span className="text-sm text-muted">
                        Rs {p.price.toLocaleString()}
                      </span>
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                        Featured
                      </span>
                    )}
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function Thumb({ url }: { url?: string }) {
  if (!url) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet-deep">
        <Package size={18} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={url}
      alt=""
      className="h-11 w-11 shrink-0 rounded-lg object-cover"
    />
  );
}
