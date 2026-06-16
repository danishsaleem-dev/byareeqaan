import Link from "next/link";
import type { Product } from "@/lib/types";
import { Reveal, RevealText } from "@/components/Reveal";
import { ProductCard } from "./ProductCard";

/** Homepage section showcasing real published products (featured first). */
export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="relative px-5 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1] text-ink">
            <RevealText text="New &" />{" "}
            <RevealText text="loved" className="italic text-gradient" />
          </h2>
          <Reveal i={1}>
            <Link
              href="/shop"
              className="text-sm font-medium text-violet-deep transition-colors hover:text-violet"
            >
              Shop all →
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} i={i % 4}>
              <ProductCard product={p} eager={i < 4} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
