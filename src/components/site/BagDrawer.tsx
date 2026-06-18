"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { useBag } from "@/lib/bag";
import { formatPrice, bagWaLink, gradFor } from "@/lib/format";
import { WhatsAppIcon } from "@/components/BrandIcons";

const ease = [0.16, 1, 0.3, 1] as const;

export function BagDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count, keyOf } =
    useBag();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={close} />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-plum/10 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <ShoppingBag size={20} className="text-violet-deep" />
                Your bag
                {count > 0 && (
                  <span className="rounded-full bg-violet-deep/10 px-2 py-0.5 text-xs font-medium text-violet-deep">
                    {count}
                  </span>
                )}
              </h2>
              <button
                onClick={close}
                aria-label="Close bag"
                className="flex h-9 w-9 items-center justify-center rounded-full text-plum transition-colors hover:bg-plum/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet-deep">
                  <ShoppingBag size={26} />
                </span>
                <div>
                  <p className="font-display text-xl text-ink">Your bag is empty</p>
                  <p className="mt-1 text-sm text-muted">
                    Add a few favourites and they&apos;ll show up here.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={close}
                  className="rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-violet"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto px-5 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((it) => {
                        const k = keyOf(it);
                        const over =
                          it.stock != null && it.qty > it.stock;
                        return (
                          <motion.li
                            key={k}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="flex gap-3"
                          >
                            <Link
                              href={`/shop/${it.slug}`}
                              onClick={close}
                              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                              style={{ background: gradFor(it.productId) }}
                            >
                              {it.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/shop/${it.slug}`}
                                  onClick={close}
                                  className="min-w-0"
                                >
                                  <p className="truncate font-medium text-ink">
                                    {it.name}
                                  </p>
                                  {it.variantTitle && (
                                    <p className="text-xs text-muted">
                                      {it.variantTitle}
                                    </p>
                                  )}
                                </Link>
                                <button
                                  onClick={() => remove(k)}
                                  aria-label="Remove"
                                  className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-plum/5 hover:text-rose-600"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>

                              <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="flex items-center rounded-full border border-plum/15">
                                  <button
                                    onClick={() => setQty(k, it.qty - 1)}
                                    aria-label="Decrease quantity"
                                    className="flex h-8 w-8 items-center justify-center text-plum transition-colors hover:text-violet-deep"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-7 text-center text-sm font-medium text-ink">
                                    {it.qty}
                                  </span>
                                  <button
                                    onClick={() => setQty(k, it.qty + 1)}
                                    aria-label="Increase quantity"
                                    className="flex h-8 w-8 items-center justify-center text-plum transition-colors hover:text-violet-deep"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="text-sm font-semibold text-violet-deep">
                                  {formatPrice(it.price * it.qty)}
                                </span>
                              </div>

                              {over && (
                                <p className="mt-1.5 text-[11px] leading-tight text-amber-600">
                                  Only {it.stock} in stock — we&apos;ll confirm if we
                                  can make up the rest.
                                </p>
                              )}
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* footer */}
                <div className="border-t border-plum/10 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="font-display text-xl font-semibold text-ink">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mb-3 text-[11px] text-muted">
                    Shipping calculated at checkout · free over Rs 5,000 in Pakistan
                  </p>
                  <a
                    href={bagWaLink(items, subtotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-deep px-6 py-3.5 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
                  >
                    <WhatsAppIcon size={18} /> Checkout on WhatsApp
                  </a>
                  <button
                    onClick={close}
                    className="mt-2 w-full rounded-full px-6 py-2.5 text-sm font-medium text-plum transition-colors hover:text-violet-deep"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
