"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string; href: string };

const AUTOPLAY_MS = 5000;

/**
 * Hero carousel — one large banner at a time, auto-advancing right every 5s.
 * Manual navigation (arrows / dots) resets the autoplay timer. Pauses on hover
 * and respects prefers-reduced-motion.
 */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Autoplay — restarts whenever `index` changes (so manual nav resets timer).
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || count <= 1 || reduced.current) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, count]);

  return (
    <div
      className="relative mx-auto w-full max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      {/* Track */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <Link
              key={s.src}
              href={s.href}
              className="relative aspect-square w-full shrink-0 cursor-pointer"
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                priority={i === 0}
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Prev / next */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white transition-colors duration-200 cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white transition-colors duration-200 cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
              i === index ? "w-6 bg-coral" : "w-2.5 bg-border hover:bg-pink"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
