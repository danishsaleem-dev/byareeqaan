"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product, Collection } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";

type Sort = "new" | "price-asc" | "price-desc";

const sorts: { value: Sort; label: string }[] = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function ShopBrowser({
  products,
  collections,
  initialCollectionId = "all",
}: {
  products: Product[];
  collections: Collection[];
  initialCollectionId?: string;
}) {
  const [active, setActive] = useState(initialCollectionId);
  const [sort, setSort] = useState<Sort>("new");

  // Only show filter chips for collections that actually have products.
  const usable = useMemo(() => {
    return collections.filter((c) =>
      products.some((p) => p.collectionIds.includes(c.id)),
    );
  }, [collections, products]);

  const shown = useMemo(() => {
    let list =
      active === "all"
        ? products
        : products.filter((p) => p.collectionIds.includes(active));
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, active, sort]);

  if (products.length === 0) {
    return (
      <div className="px-5 pb-24 sm:px-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      {/* controls */}
      <div className="mb-8 flex flex-col gap-4 border-b border-plum/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        {usable.length > 0 && (
          <div className="-mx-1 flex flex-wrap gap-2">
            <Chip active={active === "all"} onClick={() => setActive("all")}>
              All
            </Chip>
            {usable.map((c) => (
              <Chip
                key={c.id}
                active={active === c.id}
                onClick={() => setActive(c.id)}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        )}
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-plum/15 bg-white px-4 py-2 text-sm text-plum outline-none transition-colors focus:border-violet"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-6 text-xs uppercase tracking-luxe text-muted">
        {shown.length} {shown.length === 1 ? "piece" : "pieces"}
      </p>

      <motion.div
        layout
        className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease, delay: (i % 8) * 0.04 }}
            >
              <ProductCard product={p} eager={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-sm text-muted">
          No pieces in this edit yet — try another filter.
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-violet-deep text-ivory shadow-soft"
          : "border border-plum/15 text-plum hover:border-violet/40 hover:text-violet-deep"
      }`}
    >
      {children}
    </button>
  );
}
