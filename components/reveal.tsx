"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper — replicates chiikawamarket.jp's slide-in-on-scroll.
 * Adds `.reveal--in` (slide up + fade) when the element enters the viewport,
 * once. `order` staggers sibling reveals (75ms each), like the real site.
 *
 * Renders a <div> by default; pass `as` to use another element.
 */
export function Reveal({
  children,
  order = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  order?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "reveal--in" : ""} ${className}`.trim()}
      style={{ "--reveal-order": order } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
