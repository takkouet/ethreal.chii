"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side log only; the digest correlates to the server log entry.
    // No stack/message is rendered to the user.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted">
        A little hiccup on our side. Please try again.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="rounded-full border border-border px-6 py-3 font-medium hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
        >
          Browse goods
        </Link>
      </div>
    </section>
  );
}
