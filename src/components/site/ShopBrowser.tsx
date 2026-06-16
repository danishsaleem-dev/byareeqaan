"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import type { Product, Collection } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";

type Sort = "new" | "price-asc" | "price-desc";

const sorts: { value: Sort; label: string }[] = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** A product is in stock if it has no variants, or any variant is available. */
function inStock(p: Product): boolean {
  if (!p.variants?.length) return true;
  return p.variants.some((v) => v.available);
}

function isOnSale(p: Product): boolean {
  return p.comparePrice != null && p.comparePrice > p.price;
}

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
  const [open, setOpen] = useState(false);

  // Filter state
  const [materials, setMaterials] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Only show collection chips for collections that actually have products.
  const usableCollections = useMemo(
    () =>
      collections.filter((c) =>
        products.some((p) => p.collectionIds.includes(c.id)),
      ),
    [collections, products],
  );

  // Derive facet options from the catalogue.
  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) if (p.material?.trim()) set.add(p.material.trim());
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const hasSaleItems = useMemo(() => products.some(isOnSale), [products]);

  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);

  const activeFilterCount =
    materials.length +
    (stockOnly ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (min != null ? 1 : 0) +
    (max != null ? 1 : 0);

  const shown = useMemo(() => {
    let list = products.filter((p) => {
      if (active !== "all" && !p.collectionIds.includes(active)) return false;
      if (materials.length && !materials.includes(p.material?.trim()))
        return false;
      if (stockOnly && !inStock(p)) return false;
      if (saleOnly && !isOnSale(p)) return false;
      if (min != null && p.price < min) return false;
      if (max != null && p.price > max) return false;
      return true;
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, active, materials, stockOnly, saleOnly, min, max, sort]);

  function toggleMaterial(m: string) {
    setMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  function clearAll() {
    setMaterials([]);
    setStockOnly(false);
    setSaleOnly(false);
    setMinPrice("");
    setMaxPrice("");
  }

  if (products.length === 0) {
    return (
      <div className="px-5 pb-24 sm:px-6">
        <EmptyState />
      </div>
    );
  }

  const showFilterPanel =
    allMaterials.length > 0 || priceBounds.max > priceBounds.min || hasSaleItems;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      {/* ── controls bar ───────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 border-b border-plum/10 pb-5">
        {/* collection chips */}
        {usableCollections.length > 0 && (
          <div className="-mx-1 flex flex-wrap gap-2">
            <Chip active={active === "all"} onClick={() => setActive("all")}>
              All
            </Chip>
            {usableCollections.map((c) => (
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

        {/* filter toggle + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showFilterPanel ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                open || activeFilterCount > 0
                  ? "border-violet bg-violet-deep text-ivory shadow-soft"
                  : "border-plum/15 text-plum hover:border-violet/40 hover:text-violet-deep"
              }`}
              aria-expanded={open}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ivory px-1.5 text-[11px] font-semibold text-violet-deep">
                  {activeFilterCount}
                </span>
              )}
            </button>
          ) : (
            <span />
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

        {/* filter panel */}
        <AnimatePresence initial={false}>
          {open && showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden"
            >
              <div className="grid gap-7 rounded-3xl border border-plum/10 bg-cream/40 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {/* price */}
                {priceBounds.max > priceBounds.min && (
                  <div>
                    <FilterLabel>Price</FilterLabel>
                    <div className="flex items-center gap-2">
                      <PriceInput
                        value={minPrice}
                        onChange={setMinPrice}
                        placeholder={String(priceBounds.min)}
                        ariaLabel="Minimum price"
                      />
                      <span className="text-muted">—</span>
                      <PriceInput
                        value={maxPrice}
                        onChange={setMaxPrice}
                        placeholder={String(priceBounds.max)}
                        ariaLabel="Maximum price"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-muted">
                      {formatPrice(priceBounds.min)} – {formatPrice(priceBounds.max)}
                    </p>
                  </div>
                )}

                {/* material */}
                {allMaterials.length > 0 && (
                  <div>
                    <FilterLabel>Material</FilterLabel>
                    <div className="-mx-1 flex flex-wrap gap-2">
                      {allMaterials.map((m) => (
                        <button
                          key={m}
                          onClick={() => toggleMaterial(m)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            materials.includes(m)
                              ? "border-violet bg-violet-deep text-ivory"
                              : "border-plum/15 text-plum hover:border-violet/40"
                          }`}
                        >
                          {materials.includes(m) && <Check size={12} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* availability + sale */}
                <div>
                  <FilterLabel>Availability</FilterLabel>
                  <div className="flex flex-col gap-2.5">
                    <Toggle
                      checked={stockOnly}
                      onChange={() => setStockOnly((v) => !v)}
                      label="In stock only"
                    />
                    {hasSaleItems && (
                      <Toggle
                        checked={saleOnly}
                        onChange={() => setSaleOnly((v) => !v)}
                        label="On sale"
                      />
                    )}
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-violet-deep transition-colors hover:text-violet"
                >
                  <X size={13} /> Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
        <div className="py-16 text-center">
          <p className="text-sm text-muted">
            No pieces match these filters yet.
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-3 text-sm font-medium text-violet-deep transition-colors hover:text-violet"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-luxe text-violet-deep">
      {children}
    </p>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full min-w-0 rounded-full border border-plum/15 bg-white px-3.5 py-2 text-sm text-plum outline-none transition-colors focus:border-violet [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="group inline-flex items-center gap-2.5 text-sm text-plum"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
          checked
            ? "border-violet bg-violet-deep text-ivory"
            : "border-plum/25 bg-white group-hover:border-violet/50"
        }`}
      >
        {checked && <Check size={13} />}
      </span>
      {label}
    </button>
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
