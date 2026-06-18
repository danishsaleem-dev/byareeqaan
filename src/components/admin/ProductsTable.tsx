"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Search, Plus, Trash2, Package, Star, Tag } from "lucide-react";
import { Input, StatusBadge } from "./ui";
import {
  setProductStatusAction,
  deleteProductAction,
  toggleFeaturedAction,
  toggleSoldAction,
} from "@/app/admin/actions";
import type { Product, ProductStatus } from "@/lib/types";

type Filter = "all" | ProductStatus;

export function ProductsTable({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [, start] = useTransition();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
  }, [products, query, filter]);

  const counts = useMemo(
    () => ({
      all: products.length,
      published: products.filter((p) => p.status === "published").length,
      draft: products.filter((p) => p.status === "draft").length,
      archived: products.filter((p) => p.status === "archived").length,
    }),
    [products],
  );

  function changeStatus(id: string, status: ProductStatus) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    start(() => setProductStatusAction(id, status));
  }

  function toggleFeatured(id: string, featured: boolean) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured } : p)));
    start(() => toggleFeaturedAction(id, featured));
  }

  function toggleSold(id: string, sold: boolean) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, sold } : p)));
    start(() => toggleSoldAction(id, sold));
  }

  function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    start(() => deleteProductAction(p.id));
  }

  const tabs: Filter[] = ["all", "published", "draft", "archived"];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-deep px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet"
        >
          <Plus size={16} /> New product
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap rounded-xl border border-black/10 bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === t ? "bg-violet-deep text-white" : "text-muted hover:text-ink",
              )}
            >
              {t} <span className="opacity-60">{counts[t]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        {shown.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            No products match.
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {shown.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Thumb url={p.images.find((i) => i.primary)?.url ?? p.images[0]?.url} />
                  <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink hover:text-violet-deep">
                      {p.name}
                    </span>
                    <span className="text-sm text-muted">
                      Rs {p.price.toLocaleString()}
                      {p.sku && <span className="ml-2 text-muted/70">· {p.sku}</span>}
                      {p.cost != null && p.cost > 0 && (() => {
                        const profit = p.price - p.cost;
                        const margin = Math.round((profit / p.price) * 100);
                        return profit >= 0
                          ? <span className="ml-2 font-medium text-emerald-600">+Rs {profit.toLocaleString()} ({margin}%)</span>
                          : <span className="ml-2 font-medium text-rose-500">−Rs {Math.abs(profit).toLocaleString()}</span>;
                      })()}
                    </span>
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    onClick={() => toggleSold(p.id, !p.sold)}
                    title={p.sold ? "Marked sold — tap to mark available" : "Mark as sold"}
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      p.sold
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-black/10 text-muted hover:border-violet/40 hover:text-violet-deep",
                    )}
                  >
                    <Tag size={13} /> {p.sold ? "Sold" : "Mark sold"}
                  </button>

                  <button
                    onClick={() => toggleFeatured(p.id, !p.featured)}
                    title={p.featured ? "Featured" : "Mark featured"}
                    className={clsx(
                      "rounded-lg p-1.5 transition-colors",
                      p.featured ? "text-gold" : "text-black/20 hover:text-gold/70",
                    )}
                  >
                    <Star size={17} fill={p.featured ? "currentColor" : "none"} />
                  </button>

                  <StatusBadge status={p.status} />

                  <select
                    value={p.status}
                    onChange={(e) => changeStatus(p.id, e.target.value as ProductStatus)}
                    className="cursor-pointer rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs text-plum outline-none focus:border-violet"
                  >
                    <option value="published">Publish</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archive</option>
                  </select>

                  <button
                    onClick={() => remove(p)}
                    className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
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
  return <img src={url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />;
}
