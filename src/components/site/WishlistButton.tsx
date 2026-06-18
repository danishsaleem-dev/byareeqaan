"use client";

import { useState, useTransition, useEffect } from "react";
import { Heart } from "lucide-react";
import {
  toggleWishlistAction,
  checkWishlistAction,
} from "@/app/(site)/account/wishlist/actions";

export function WishlistButton({
  productId,
  initialWishlisted = false,
  className,
  size = 18,
}: {
  productId: string;
  initialWishlisted?: boolean;
  className?: string;
  size?: number;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [checked, setChecked] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();

  // Load real state from server on mount (product pages are ISR, can't read per-user server-side)
  useEffect(() => {
    checkWishlistAction(productId)
      .then((v) => {
        setWishlisted(v);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [productId]);

  function toggle() {
    startTransition(async () => {
      const next = !wishlisted;
      setWishlisted(next);
      try {
        await toggleWishlistAction(productId, wishlisted);
      } catch {
        setWishlisted(!next); // revert
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending || !checked}
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      className={className}
    >
      <Heart
        size={size}
        className={`transition-all duration-200 ${
          wishlisted ? "fill-rose-500 stroke-rose-500" : "stroke-current"
        } ${!checked ? "opacity-40" : ""}`}
      />
    </button>
  );
}
